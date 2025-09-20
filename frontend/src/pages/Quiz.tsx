import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: "science" | "commerce" | "arts" | "technical";
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
  const { toast } = useToast();
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
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
      completeOnboarding();
      toast({
        title: "Quiz Completed!",
        description: "Taking you to your personalized career roadmap...",
      });
      navigate("/roadmap", { replace: true });
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
  };

  if (showResults) {
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
              <h3 className="font-semibold text-lg mb-3 text-foreground">
                Recommended Next Steps:
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • Explore career opportunities in your top-matching stream
                </li>
                <li>• View detailed career roadmaps for recommended paths</li>
                <li>• Research colleges that offer relevant programs</li>
                <li>
                  • Connect with career counselors for personalized guidance
                </li>
              </ul>
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
              <Button className="flex-1">
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
