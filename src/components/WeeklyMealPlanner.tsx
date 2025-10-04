import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { callGeminiAPIRaw } from "@/utils/gemini";
import { toast } from "sonner";
import { AppState } from "@/types/fitness";

interface WeeklyMealPlannerProps {
  appState: AppState;
}

const WeeklyMealPlanner = ({ appState }: WeeklyMealPlannerProps) => {
  const [mealPlan, setMealPlan] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const prompt = `Create a 7-day meal plan for bulking and muscle gain with the following requirements:

User: ${appState.user.name}
Daily Goals: ${appState.nutrition.calorieGoal} calories, ${appState.nutrition.proteinGoal}g protein
Cuisine Preference: Indian meals
Meal Structure: Breakfast, Lunch, Snack, Dinner

For EACH day, provide:
**[DAY]**
🌅 Breakfast: [Simple meal with calories and protein]
🍽️ Lunch: [Simple meal with calories and protein]
🍪 Snack: [Simple snack with calories and protein]
🌙 Dinner: [Simple meal with calories and protein]
Daily Total: ~[calories] kcal, ~[protein]g protein

Keep meals simple, practical, and high in protein. Vary the meals across the week. Focus on whole foods that support muscle growth.`;

      const result = await callGeminiAPIRaw(prompt);
      
      // Parse the result into daily plans
      const parsedPlan: Record<string, string> = {};
      days.forEach(day => {
        const dayRegex = new RegExp(`\\*\\*${day}\\*\\*([\\s\\S]*?)(?=\\*\\*(?:${days.join('|')})|$)`, 'i');
        const match = result.match(dayRegex);
        if (match) {
          parsedPlan[day] = match[1].trim();
        }
      });

      setMealPlan(parsedPlan);
      toast.success("Weekly meal plan generated!");
    } catch (error) {
      toast.error("Failed to generate meal plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📅 Weekly Meal Planner</h2>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Weekly Plan"}
        </Button>
      </div>

      {Object.keys(mealPlan).length > 0 ? (
        <Tabs defaultValue="Monday" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            {days.map(day => (
              <TabsTrigger key={day} value={day} className="text-xs">
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          {days.map(day => (
            <TabsContent key={day} value={day} className="mt-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{day}</h3>
                <div className="whitespace-pre-wrap text-sm">
                  {mealPlan[day] || "No plan for this day"}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Click "Generate Weekly Plan" to create your personalized meal schedule</p>
        </div>
      )}
    </Card>
  );
};

export default WeeklyMealPlanner;
