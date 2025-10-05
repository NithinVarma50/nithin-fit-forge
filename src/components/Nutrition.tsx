import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppState } from "@/types/fitness";
import { callGeminiAPI } from "@/utils/gemini";
import { toast } from "sonner";
import RecipeCard from "@/components/RecipeCard";
import { StructuredRecipe } from "@/utils/aiParser";

interface NutritionProps {
  appState: AppState;
  onMealAdd: (calories: number, protein: number) => void;
  onResetNutrition: () => void;
  onUndoMeal: () => void;
  canUndo: boolean;
}

const Nutrition = ({ appState, onMealAdd, onResetNutrition, onUndoMeal, canUndo }: NutritionProps) => {
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [foodSuggestions, setFoodSuggestions] = useState<string>(
    "Log your first meal to get personalized suggestions!"
  );
  const [structuredRecipe, setStructuredRecipe] = useState<StructuredRecipe | null>(null);
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
      // Determine meal type based on current time
      const currentHour = new Date().getHours();
      let suggestedMealType = "Breakfast";
      
      if (currentHour >= 19) {
        suggestedMealType = "Dinner";
      } else if (currentHour >= 14) {
        suggestedMealType = "Snack";
      } else if (currentHour >= 11) {
        suggestedMealType = "Lunch";
      }
      
      const age = Math.floor((new Date().getTime() - new Date(appState.user.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const { calories: currentCal, protein: currentPro, calorieGoal, proteinGoal } = appState.nutrition;
      const remainingCal = calorieGoal - currentCal;
      const remainingPro = proteinGoal - currentPro;
      
      const prompt = `Generate ${suggestedMealType} suggestions for bulking and muscle gain.

User Profile:
- Name: ${appState.user.name}, Age: ${age}
- Goal: Bulking for muscle gain
- Daily Targets: ${calorieGoal} calories, ${proteinGoal}g protein
- Today's Progress: ${Math.round(currentCal)}/${calorieGoal} kcal, ${Math.round(currentPro)}/${proteinGoal}g protein consumed
- Remaining: ${Math.round(remainingCal)} kcal, ${Math.round(remainingPro)}g protein needed

Meal Type: ${suggestedMealType}

Generate 3-4 high-protein Indian ${suggestedMealType.toLowerCase()} options that are:
- Simple and practical to prepare
- High in protein and calories for bulking
- Suitable for the time of day
- Include both vegetarian and non-vegetarian options

For EACH meal option, provide:
**Option [#]: [Meal Name]**
🍽️ Ingredients:
- [Ingredient 1 with amount]
- [Ingredient 2 with amount]
[etc.]

👨‍🍳 Preparation:
1. [Step 1]
2. [Step 2]
[etc.]

📊 Nutrition:
- Calories: ~[amount] kcal
- Protein: ~[amount]g
- Carbs: ~[amount]g
- Fats: ~[amount]g

⏱️ Prep Time: [time]

Make the suggestions practical, delicious, and aligned with bulking goals!`;
      
      const result = await callGeminiAPI(prompt, "recipe");
      
      if (result.type === "recipe") {
        setStructuredRecipe(result.content);
        setFoodSuggestions(result.content.description);
      } else {
        // Fallback to text display if parsing failed
        setFoodSuggestions(result.content);
        setStructuredRecipe(null);
      }
      toast.success("Meal ideas generated!");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to generate meal ideas";
      toast.error(errorMsg);
      setFoodSuggestions("Failed to generate meal ideas. Please try again.");
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
          <div className="flex gap-2 mt-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={onUndoMeal}
              disabled={!canUndo}
              className="flex-1"
            >
              Undo Last Meal
            </Button>
            <Button 
              type="button"
              variant="destructive" 
              onClick={() => {
                onResetNutrition();
                toast.success("Nutrition reset successfully!");
              }}
              className="flex-1"
            >
              Reset Today's Goals
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dietary Suggestions</h2>
          <div className="flex gap-2">
            {structuredRecipe && (
              <Button
                onClick={() => setStructuredRecipe(null)}
                size="sm"
                variant="outline"
              >
                <span className="mr-2">📝</span>
                Text View
              </Button>
            )}
            <Button 
              onClick={handleGenerateMealIdeas}
              disabled={isLoadingSuggestions}
              size="sm"
            >
              <span className="mr-2">✨</span>
              Generate Meal Ideas
            </Button>
          </div>
        </div>
        <div className="space-y-3 text-card-foreground min-h-[150px]">
          {isLoadingSuggestions ? (
            <div className="animate-pulse">Generating meal ideas...</div>
          ) : structuredRecipe ? (
            <RecipeCard 
              title={structuredRecipe.title}
              description={structuredRecipe.description}
              sections={structuredRecipe.sections}
              totalNutrition={structuredRecipe.totalNutrition}
            />
          ) : (
            <p>{foodSuggestions}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Nutrition;
