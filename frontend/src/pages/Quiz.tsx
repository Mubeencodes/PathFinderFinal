import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getCollegeRecommendations } from "@/lib/api";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  RotateCcw,
  GraduationCap,
  MapPin,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: "science" | "commerce" | "arts" | "technical";
}

interface CollegeRecommendation {
  institute_short: string;
  program_name: string;
  category: string;
  closing_rank: number;
  eligibility_prob: number;
}

interface CombinedResponse {
  ml: CollegeRecommendation[];
  llm: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which subject do you find most interesting?",
    options: [
      "Mathematics and Physics",
      "Economics and Business Studies",
      "Literature and History",
      "Computer Programming",
    ],
    category: "science",
  },
  {
    id: 2,
    question: "What type of problems do you enjoy solving?",
    options: [
      "Scientific experiments and calculations",
      "Market analysis and financial planning",
      "Creative writing and research",
      "Coding and technical challenges",
    ],
    category: "technical",
  },
  {
    id: 3,
    question: "In your free time, you prefer to:",
    options: [
      "Read science magazines",
      "Follow business news",
      "Create art or write stories",
      "Build apps or websites",
    ],
    category: "science",
  },
  {
    id: 4,
    question: "Your ideal work environment would be:",
    options: [
      "Research laboratory",
      "Corporate office",
      "Creative studio",
      "Tech startup",
    ],
    category: "technical",
  },
  {
    id: 5,
    question: "Which career sounds most appealing?",
    options: [
      "Doctor or Engineer",
      "Business Manager or Entrepreneur",
      "Teacher or Journalist",
      "Software Developer or Data Scientist",
    ],
    category: "science",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [boardMarks, setBoardMarks] = useState("");
  const [entranceRank, setEntranceRank] = useState("");
  const [collegeRecommendations, setCollegeRecommendations] = useState<
    CollegeRecommendation[]
  >([]);
  const [counselingText, setCounselingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCollegeResults, setShowCollegeResults] = useState(false);
  const { toast } = useToast();
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const fetchCollegeRecommendations = async () => {
    setIsLoading(true);
    try {
      // Extract interests from quiz answers
      const interests = Object.values(answers).map((answer) => {
        // Map quiz answers to more specific interests
        if (
          answer.includes("Mathematics and Physics") ||
          answer.includes("Scientific experiments")
        ) {
          return "Engineering";
        } else if (
          answer.includes("Economics and Business") ||
          answer.includes("Market analysis")
        ) {
          return "Business";
        } else if (
          answer.includes("Literature and History") ||
          answer.includes("Creative writing")
        ) {
          return "Arts";
        } else if (
          answer.includes("Computer Programming") ||
          answer.includes("Coding")
        ) {
          return "Computer Science";
        } else if (answer.includes("Doctor or Engineer")) {
          return "Medical";
        } else if (answer.includes("Business Manager")) {
          return "Management";
        } else if (answer.includes("Teacher or Journalist")) {
          return "Education";
        } else if (answer.includes("Software Developer")) {
          return "Technology";
        }
        return "General";
      });

      const response = await getCollegeRecommendations({
        interests: interests,
        board_marks: parseFloat(boardMarks) || null,
        entrance_exam_rank: parseInt(entranceRank) || 1000,
      });

      setCollegeRecommendations(response.data.ml);
      setCounselingText(response.data.llm);
      setShowCollegeResults(true);

      toast({
        title: "Recommendations Generated!",
        description: "Your personalized college recommendations are ready.",
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch college recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description:
          "Choose one option before proceeding to the next question.",
        variant: "destructive",
      });
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: selectedAnswer,
    }));

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      setShowResults(true);
      setSelectedAnswer("");
    }
  };

  const calculateResults = () => {
    const scores = {
      science: 0,
      commerce: 0,
      arts: 0,
      technical: 0,
    };

    Object.values(answers).forEach((answer, index) => {
      const answerIndex = questions[index].options.indexOf(answer);
      switch (answerIndex) {
        case 0:
          scores.science++;
          break;
        case 1:
          scores.commerce++;
          break;
        case 2:
          scores.arts++;
          break;
        case 3:
          scores.technical++;
          break;
      }
    });

    return Object.entries(scores)
      .map(([stream, score]) => ({
        stream,
        score,
        percentage: (score / questions.length) * 100,
      }))
      .sort((a, b) => b.score - a.score);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedAnswer("");
    setBoardMarks("");
    setEntranceRank("");
    setCollegeRecommendations([]);
    setCounselingText("");
    setShowCollegeResults(false);
    setIsLoading(false);
  };

  if (showResults && !showCollegeResults) {
    const results = calculateResults();

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-strong">
          <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg">
              Based on your responses, here are your recommended streams
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={result.stream} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg capitalize text-foreground">
                      {result.stream === "technical"
                        ? "Technology"
                        : result.stream}{" "}
                      Stream
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {result.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={result.percentage} className="h-3" />
                  {index === 0 && (
                    <div className="mt-2 text-sm text-success font-medium">
                      🎯 Best Match
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Additional Information for College Recommendations:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="board-marks" className="text-sm font-medium">
                    Board Marks (%)
                  </Label>
                  <Input
                    id="board-marks"
                    type="number"
                    placeholder="Enter your board percentage"
                    value={boardMarks}
                    onChange={(e) => setBoardMarks(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="entrance-rank"
                    className="text-sm font-medium"
                  >
                    Entrance Exam Rank
                  </Label>
                  <Input
                    id="entrance-rank"
                    type="number"
                    placeholder="Enter your entrance exam rank"
                    value={entranceRank}
                    onChange={(e) => setEntranceRank(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={restartQuiz}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <Button
                onClick={fetchCollegeRecommendations}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading
                  ? "Generating Recommendations..."
                  : "Get College Recommendations"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCollegeResults) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="shadow-strong">
          <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
            <GraduationCap className="h-16 w-16 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold">
              Your College Recommendations
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg">
              Personalized recommendations based on your quiz results
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {/* College Recommendations */}
            <div className="space-y-6">
              <h3 className="font-semibold text-xl text-foreground">
                Recommended Colleges:
              </h3>
              {collegeRecommendations.length > 0 ? (
                <div className="grid gap-6">
                  {collegeRecommendations.map((college, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-xl text-foreground mb-2">
                              {college.institute_short}
                            </h4>
                            <p className="text-lg text-muted-foreground mb-2">
                              {college.program_name}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Category: {college.category}
                              </span>
                              <span>Closing Rank: {college.closing_rank}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold text-lg">
                                {(college.eligibility_prob * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Eligibility Score
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${college.eligibility_prob * 100}%`,
                            }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No college recommendations available at the moment.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={restartQuiz}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <Button
                onClick={() => {
                  completeOnboarding();
                  navigate("/roadmap", { replace: true });
                }}
                className="flex-1"
              >
                View Career Roadmap
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Career Aptitude Quiz
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Answer these questions to discover the best career stream for you
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {progress.toFixed(0)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            {questions[currentQuestion].question}
          </CardTitle>
          <CardDescription>
            Select the option that best describes you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-hover transition-colors"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-foreground font-medium"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion((prev) => prev - 1);
                  setSelectedAnswer(
                    answers[questions[currentQuestion - 1].id] || ""
                  );
                }
              }}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentQuestion + 1 === questions.length
                ? "Complete Quiz"
                : "Next Question"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
