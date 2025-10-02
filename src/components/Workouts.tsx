import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppState } from "@/types/fitness";
import { getTodayName } from "@/utils/fitness";
import { callGeminiAPI } from "@/utils/gemini";
import { toast } from "sonner";

interface WorkoutsProps {
  appState: AppState;
  onReminderSet: (time: string) => void;
}

const Workouts = ({ appState, onReminderSet }: WorkoutsProps) => {
  const [reminderTime, setReminderTime] = useState(appState.user.reminderTime);
  const [loadingVariations, setLoadingVariations] = useState<string | null>(null);
  const [variations, setVariations] = useState<Record<string, string>>({});

  const todayName = getTodayName();

  const handleSetReminder = () => {
    onReminderSet(reminderTime);
    toast.success(`Reminder set for ${reminderTime}!`);
  };

  const handleSuggestVariations = async (day: string, workout: { name: string; exercises: string[] }) => {
    setLoadingVariations(day);
    try {
      const prompt = `I'm doing a workout called "${workout.name}". My current exercises are: ${workout.exercises.join(', ')}. My main goal is bulking. Suggest 2-3 alternative dumbbell exercises I can do instead to target the same muscle groups. Keep it short and list them simply.`;
      const result = await callGeminiAPI(prompt, "workout");
      
      // Use the content regardless of whether it was parsed as structured data or not
      const variationText = result.type === "workout" ? result.content.description : result.content;
      setVariations(prev => ({ ...prev, [day]: variationText }));
    } catch (error) {
      toast.error("Failed to generate variations. Please try again.");
    } finally {
      setLoadingVariations(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Weekly Workout Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {appState.workoutPlan.map((workout) => {
            const isToday = workout.day === todayName;
            return (
              <div
                key={workout.day}
                className={`p-4 rounded-lg border-2 ${
                  isToday ? 'border-primary bg-primary/10' : 'bg-muted border-border'
                }`}
              >
                <h4 className={`font-bold text-lg ${isToday ? 'text-primary' : ''}`}>
                  {workout.day}
                </h4>
                <p className="text-sm text-muted-foreground my-2 h-10">
                  {workout.name}
                </p>
                <div className="mt-2">
                  {workout.completed ? (
                    <span className="text-success font-bold">✓ Completed</span>
                  ) : (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handleSuggestVariations(workout.day, workout)}
                  disabled={loadingVariations === workout.day}
                >
                  ✨ Suggest Variations
                </Button>
                {variations[workout.day] && (
                  <div className="mt-2 text-xs bg-card p-2 rounded border border-border">
                    {variations[workout.day]}
                  </div>
                )}
                {loadingVariations === workout.day && (
                  <div className="mt-2 text-xs text-muted-foreground animate-pulse">
                    Loading...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-2">Workout Reminders</h3>
        <p className="text-muted-foreground mb-4">
          Set a time to get notified for your daily workout.
        </p>
        <div className="flex items-center space-x-4">
          <Input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleSetReminder}>Set Reminder</Button>
        </div>
      </Card>
    </div>
  );
};

export default Workouts;
