import json
from fastapi import FastAPI, Depends
from schemas import CounselRequest, CounselResponse, CounselTextResponse, CollegeRecommendation
from ai.ollamas import Ollama
from ai.retrieve import Retriever
from auth.dependencies import get_user_identifier
from auth.throttling import apply_rate_limit
import joblib
import pandas as pd

app = FastAPI()

# --- Load system prompt ---
def load_system_prompt():
    try:
        with open("prompt/system_prompt.md", "r") as f:
            return f.read()
    except FileNotFoundError:
        print("Warning: system_prompt.md not found.")
        return ""

SYSTEM_PROMPT = load_system_prompt()
ai_platform = Ollama(model="mistral")

retriever = None
retriever_error = None
try:
    retriever = Retriever()
except Exception as e:
    retriever_error = str(e)
    print(f"Retriever failed to initialize: {retriever_error}")

# --- Load ML model ---
ml_model = None
try:
    ml_model = joblib.load("college_eligibility_predictor.pkl")
except Exception as e:
    print(f"ML model failed to load: {e}")


# --- AI counseling endpoint (LLM text output) ---
@app.post("/counseling", response_model=CounselTextResponse)
async def cl_rec(request: CounselRequest, user_id: str = Depends(get_user_identifier)):
    apply_rate_limit(user_id)

    if not retriever:
        error_message = f"Error: The recommendation engine is not available. Details: {retriever_error}"
        return CounselTextResponse(recommendation=error_message)

    interests_query = ", ".join(request.interests)
    similar_colleges = retriever.find_similar_colleges(interests_query, top_k=10)
    context_str = json.dumps(similar_colleges, indent=2)

    prompt_text = (
        f"Student Profile:\n"
        f"Interests: {interests_query}\n"
        f"Boards Marks: {request.board_marks}%\n"
        f"Entrance Exam Marks: {request.entrance_exam_marks}\n\n"
        f"Here is a list of potentially relevant colleges based on their interests:\n{context_str}\n\n"
        f"Based on the student's complete profile and ONLY using the colleges from the list provided above, "
        f"recommend the top 3 best-fit colleges and justify your choices."
    )

    full_prompt = f"{SYSTEM_PROMPT}\n\n{prompt_text}"
    response_text = ai_platform.chat(full_prompt)

    return CounselTextResponse(recommendation=response_text)


# --- ML rank-based recommender endpoint ---
@app.post("/recommend", response_model=CounselResponse)
async def recommend_colleges(request: CounselRequest, user_id: str = Depends(get_user_identifier)):
    apply_rate_limit(user_id)

    if not retriever:
        return CounselResponse(recommendation=[])

    if not ml_model:
        return CounselResponse(recommendation=[])

    # Step 1: Retrieve relevant colleges based on interests
    query = ", ".join(request.interests)
    candidates = retriever.find_similar_colleges(query, top_k=20)

    if not candidates:
        return CounselResponse(recommendation=[])

    # Step 2: Convert retrieved data to DataFrame
    df_candidates = pd.DataFrame(candidates)

    # Step 3: Build ML model input using ONLY entrance exam rank
    X_new = pd.DataFrame({
        "student_rank": [request.entrance_exam_rank] * len(df_candidates),
        "program_name": df_candidates.get("program_name", df_candidates.get("name")),
        "category": df_candidates.get("category", "GEN"),
    })

    # Step 4: Predict eligibility probabilities
    probs = ml_model.predict_proba(X_new)[:, 1]
    df_candidates["eligibility_prob"] = probs

    # Step 5: Sort & return top 3 recommended programs
    top = df_candidates.sort_values("eligibility_prob", ascending=False).head(3)

    # Convert DataFrame rows into Pydantic models
    recommendations = [
        CollegeRecommendation(
            institute_short=row.get("institute_short", ""),
            program_name=row.get("program_name", ""),
            category=row.get("category", ""),
            closing_rank=row.get("closing_rank", None),
            eligibility_prob=row.get("eligibility_prob", 0.0)
        )
        for _, row in top.iterrows()
    ]

    return CounselResponse(recommendation=recommendations)


@app.get("/")
async def root():
    return {"message": "College Counseling API with RAG is running."}
