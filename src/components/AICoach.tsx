import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { callGeminiAPIRaw } from "@/utils/gemini";
import { toast } from "sonner";
import { AppState } from "@/types/fitness";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AICoachProps {
  appState: AppState;
}

const AICoach = ({ appState }: AICoachProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm your AI fitness coach. Ask me anything about workouts, nutrition, bulking strategies, or form tips!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Calculate age from DOB
      const age = Math.floor((new Date().getTime() - new Date(appState.user.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      const context = `User Profile: ${appState.user.name}, Age: ${age}, Goal: Bulking
Current Weight: ${appState.user.currentWeight}kg, Target: ${appState.user.goals.targetWeight}
Daily Goals: ${appState.nutrition.calorieGoal} calories, ${appState.nutrition.proteinGoal}g protein
Current Progress: ${Math.round(appState.nutrition.calories)} calories, ${Math.round(appState.nutrition.protein)}g protein consumed today
Workout Streak: ${appState.workoutStreak} days

You are a knowledgeable, motivating fitness coach specializing in bulking and muscle gain for young adults. Provide practical, actionable advice. Keep responses concise and encouraging.

User Question: ${input}`;

      const response = await callGeminiAPIRaw(context);

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="p-6 flex flex-col h-[600px]">
      <h2 className="text-2xl font-bold mb-4">💬 AI Coach Chat</h2>
      
      <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about workouts, nutrition, or form tips..."
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </div>
    </Card>
  );
};

export default AICoach;
