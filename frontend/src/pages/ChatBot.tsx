import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Lightbulb,
  HelpCircle,
  BookOpen,
} from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface FAQ {
  question: string;
  category: string;
}

const frequentQuestions: FAQ[] = [
  {
    question: "What streams should I choose after 10th?",
    category: "Stream Selection",
  },
  { question: "How do I prepare for JEE Main?", category: "Exam Preparation" },
  {
    question: "What are the career options in Commerce?",
    category: "Career Guidance",
  },
  {
    question: "Which colleges are best for Computer Science?",
    category: "College Information",
  },
  { question: "How to apply for scholarships?", category: "Financial Aid" },
  {
    question: "What is the scope of Arts stream?",
    category: "Stream Selection",
  },
];

const botResponses = {
  greeting:
    "Hello! I'm PathBot, your AI career guidance assistant. How can I help you today?",
  streamSelection:
    "Great question! Stream selection depends on your interests and career goals. Science stream is ideal for engineering, medical, and research careers. Commerce is perfect for business, finance, and management roles. Arts opens doors to creative, social sciences, and humanities careers. What are your main interests?",
  jeePrep:
    "For JEE Main preparation, I recommend: 1) Start with NCERT books for strong fundamentals, 2) Practice previous year papers, 3) Take regular mock tests, 4) Focus on Physics, Chemistry, and Mathematics equally, 5) Join a good coaching institute or online platform. Would you like specific study resources?",
  commerce:
    "Commerce stream offers excellent career opportunities! Popular options include: Chartered Accountancy (CA), Company Secretary (CS), Cost and Management Accountancy (CMA), Bachelor of Commerce (B.Com), Business Administration (BBA), Economics, and Banking & Finance. Each has different entry requirements and career prospects.",
  colleges:
    "For Computer Science, top colleges include IITs, NITs, BITS, and other premier institutions. Admission is typically through JEE Main/Advanced. I can help you find colleges based on your location, budget, and preferences. What's your current academic performance?",
  scholarships:
    "There are many scholarship opportunities! Government scholarships include National Merit Scholarship, Post-Matric Scholarships, and state-specific programs. Private scholarships are offered by companies like Tata, Reliance, and educational foundations. I can help you find scholarships based on your profile.",
  arts: "Arts stream offers diverse career paths! Options include: Literature, History, Political Science, Psychology, Sociology, Fine Arts, Journalism, Teaching, Civil Services, Law, and Creative fields like writing, filmmaking, and design. The scope is vast and rewarding!",
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: botResponses.greeting,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simple response logic based on keywords
    setTimeout(() => {
      let botResponse =
        "I understand your question. Let me help you with that. For detailed guidance, I recommend speaking with our career counselors or exploring our resources in the Study Materials section.";

      const messageText = inputMessage.toLowerCase();
      if (
        messageText.includes("stream") ||
        messageText.includes("after 10th")
      ) {
        botResponse = botResponses.streamSelection;
      } else if (
        messageText.includes("jee") ||
        messageText.includes("engineering exam")
      ) {
        botResponse = botResponses.jeePrep;
      } else if (
        messageText.includes("commerce") ||
        messageText.includes("business")
      ) {
        botResponse = botResponses.commerce;
      } else if (
        messageText.includes("college") ||
        messageText.includes("computer science")
      ) {
        botResponse = botResponses.colleges;
      } else if (
        messageText.includes("scholarship") ||
        messageText.includes("financial aid")
      ) {
        botResponse = botResponses.scholarships;
      } else if (
        messageText.includes("arts") ||
        messageText.includes("humanities")
      ) {
        botResponse = botResponses.arts;
      }

      const botMessage: Message = {
        id: messages.length + 2,
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setInputMessage("");
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            AI Career Assistant
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Get instant answers to your career and education questions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="shadow-strong h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                PathBot - AI Assistant
                <Badge variant="secondary" className="ml-auto">
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground border border-border"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === "bot" && (
                            <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          {message.sender === "user" && (
                            <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me about careers, colleges, exams, or anything else..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {/* Frequent Questions */}
          <Card className="shadow-medium w-fit ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-secondary" />
                Frequently Asked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 ">
              {frequentQuestions.map((faq, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-hover"
                  onClick={() => handleQuestionClick(faq.question)}
                >
                  <div className="w-full">
                    <p className="text-sm font-medium text-foreground break-words">
                      {faq.question}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
