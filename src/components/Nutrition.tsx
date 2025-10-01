import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppState } from "@/types/fitness";
import { callGeminiAPI } from "@/utils/gemini";
import { toast } from "sonner";

interface NutritionProps {
  appState: AppState;
  onMealAdd: (calories: number, protein: number) => void;
}

const Nutrition = ({ appState, onMealAdd }: NutritionProps) => {
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [foodSuggestions, setFoodSuggestions] = useState<string>(
    "Log your first meal to get personalized suggestions!"
  );
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cal = parseInt(calories, 10);
    const pro = parseInt(protein, 10);
    if (!isNaN(cal) && !isNaN(pro)) {
      onMealAdd(cal, pro);
      setCalories("");
      setProtein("");
      toast.success(`${mealType} logged successfully!`);
    }
  };

  const handleGenerateMealIdeas = async () => {
    setIsLoadingSuggestions(true);
    try {
      const { calories: currentCal, protein: currentPro, calorieGoal, proteinGoal } = appState.nutrition;
      const prompt = `My fitness goal is bulking for muscle gain. Today I need to consume ${calorieGoal} calories and ${proteinGoal}g of protein. So far, I've had ${Math.round(currentCal)} calories and ${Math.round(currentPro)}g of protein. Suggest a simple, high-protein Indian meal or snack I can have next to help me reach my goal. Be specific and give one option.`;
      const result = await callGeminiAPI(prompt);
      setFoodSuggestions(result);
    } catch (error) {
      toast.error("Failed to generate meal ideas. Please try again.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Log Your Meals</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger id="meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="calories-input">Calories (kcal)</Label>
            <Input
              id="calories-input"
              type="number"
              placeholder="e.g., 500"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="protein-input">Protein (g)</Label>
            <Input
              id="protein-input"
              type="number"
              placeholder="e.g., 30"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Add Meal
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dietary Suggestions</h2>
          <Button 
            onClick={handleGenerateMealIdeas}
            disabled={isLoadingSuggestions}
            size="sm"
          >
            <span className="mr-2">✨</span>
            Generate Meal Ideas
          </Button>
        </div>
        <div className="space-y-3 text-card-foreground min-h-[150px]">
          {isLoadingSuggestions ? (
            <div className="animate-pulse">Generating meal ideas...</div>
          ) : (
            <p>{foodSuggestions}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Nutrition;
