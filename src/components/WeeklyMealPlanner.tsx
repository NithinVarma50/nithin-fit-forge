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
      const age = Math.floor((new Date().getTime() - new Date(appState.user.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      const prompt = `Create a complete 7-day meal plan optimized for bulking and muscle gain.

User Profile:
- Name: ${appState.user.name}
- Age: ${age}
- Current Weight: ${appState.user.currentWeight}kg
- Target: ${appState.user.goals.targetWeight}
- Daily Nutrition Goals: ${appState.nutrition.calorieGoal} calories, ${appState.nutrition.proteinGoal}g protein

Requirements:
- Cuisine: Primarily Indian meals (with variety)
- Meal Structure: 4 meals per day (Breakfast, Lunch, Snack, Dinner)
- High protein, calorie-dense meals for bulking
- Include both vegetarian and non-vegetarian options
- Practical, easy-to-prepare meals
- Vary meals across the week to avoid monotony

Format EXACTLY as follows for EACH DAY:

**Monday**
🌅 Breakfast: [Meal name] - [calories]kcal, [protein]g protein
🍽️ Lunch: [Meal name] - [calories]kcal, [protein]g protein  
🍪 Snack: [Snack name] - [calories]kcal, [protein]g protein
🌙 Dinner: [Meal name] - [calories]kcal, [protein]g protein
📊 Daily Total: ~[total calories] kcal, ~[total protein]g protein

[Repeat for Tuesday through Sunday]

Keep meals simple, affordable, and suitable for muscle building. Include portion sizes and meal timing suggestions where helpful.`;

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

      if (Object.keys(parsedPlan).length === 0) {
        // Fallback: just display the raw result
        parsedPlan["Monday"] = result;
      }

      setMealPlan(parsedPlan);
      toast.success("Weekly meal plan generated!");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to generate meal plan";
      toast.error(errorMsg);
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
