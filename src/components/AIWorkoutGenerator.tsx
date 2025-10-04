import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { callGeminiAPI } from "@/utils/gemini";
import { toast } from "sonner";
import { AppState } from "@/types/fitness";

interface AIWorkoutGeneratorProps {
  appState: AppState;
  onWorkoutGenerated?: (workout: string) => void;
}

const AIWorkoutGenerator = ({ appState, onWorkoutGenerated }: AIWorkoutGeneratorProps) => {
  const [muscleGroup, setMuscleGroup] = useState("Full Body");
  const [duration, setDuration] = useState("45");
  const [equipment, setEquipment] = useState("Gym");
  const [generatedWorkout, setGeneratedWorkout] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const prompt = `Create a detailed ${duration}-minute ${muscleGroup} workout for bulking and muscle gain.
Equipment available: ${equipment}
Fitness level: Intermediate
Goal: Muscle hypertrophy and strength

Format the workout as:
**Warm-up (5 mins)**
- List warm-up exercises

**Main Workout**
For each exercise include:
- Exercise name
- Sets x Reps
- Rest period
- Form tips

**Cool-down (5 mins)**
- Stretching routine

Focus on compound movements and progressive overload. Make it practical and effective for ${appState.user.name}'s bulking goals.`;

      const result = await callGeminiAPI(prompt);
      const workoutText = result.type === "text" ? result.content : result.content.description || "Workout generated";
      
      setGeneratedWorkout(workoutText);
      onWorkoutGenerated?.(workoutText);
      toast.success("Workout generated successfully!");
    } catch (error) {
      toast.error("Failed to generate workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏋️ AI Workout Generator</h2>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Muscle Group</label>
          <Select value={muscleGroup} onValueChange={setMuscleGroup}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Body">Full Body</SelectItem>
              <SelectItem value="Upper Body">Upper Body</SelectItem>
              <SelectItem value="Lower Body">Lower Body</SelectItem>
              <SelectItem value="Push">Push (Chest, Shoulders, Triceps)</SelectItem>
              <SelectItem value="Pull">Pull (Back, Biceps)</SelectItem>
              <SelectItem value="Legs">Legs</SelectItem>
              <SelectItem value="Core">Core & Abs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Equipment Available</label>
          <Select value={equipment} onValueChange={setEquipment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gym">Full Gym Access</SelectItem>
              <SelectItem value="Dumbbells">Dumbbells Only</SelectItem>
              <SelectItem value="Bodyweight">Bodyweight Only</SelectItem>
              <SelectItem value="Minimal">Minimal Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Generating Workout..." : "Generate Workout Plan"}
        </Button>
      </div>

      {generatedWorkout && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-bold mb-2">Your Workout Plan</h3>
          <div className="text-sm whitespace-pre-wrap">{generatedWorkout}</div>
        </div>
      )}
    </Card>
  );
};

export default AIWorkoutGenerator;
