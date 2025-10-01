import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppState } from "@/types/fitness";
import { getTodayName } from "@/utils/fitness";
import { callGeminiAPI } from "@/utils/gemini";
import { toast } from "sonner";
import NutritionBar from "./NutritionBar";
import WeightChart from "./WeightChart";

interface DashboardProps {
  appState: AppState;
  onCheckin: () => void;
}

const Dashboard = ({ appState, onCheckin }: DashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivation, setMotivation] = useState<string>("Loading motivation...");
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(true);
  const [reminders, setReminders] = useState<Array<{ time: string; text: string }>>([]);

  const todayName = getTodayName();
  const todaysWorkout = appState.workoutPlan.find(w => w.day === todayName);
  const isCheckedIn = todaysWorkout?.completed || false;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    updateReminders();
    const reminderTimer = setInterval(updateReminders, 60000);
    return () => clearInterval(reminderTimer);
  }, [appState.user.reminderTime]);

  useEffect(() => {
    loadMotivation();
  }, []);

  const loadMotivation = async () => {
    setIsLoadingMotivation(true);
    try {
      const prompt = "Give me a short, powerful, Gen-Z style motivational quote for a young guy named Nithin who is focused on bulking up and hitting the gym. Make it energetic and straight to the point.";
      const result = await callGeminiAPI(prompt);
      setMotivation(result);
    } catch (error) {
      setMotivation("Push through the pain, Nithin! Every rep counts! 💪");
    } finally {
      setIsLoadingMotivation(false);
    }
  };

  const updateReminders = () => {
    const hour = new Date().getHours();
    const newReminders: Array<{ time: string; text: string }> = [];

    if (hour >= 8 && hour < 10) {
      newReminders.push({ time: 'Breakfast', text: 'Time for a high-protein breakfast to start your day strong.' });
    }
    if (hour >= 12 && hour < 14) {
      newReminders.push({ time: 'Lunch', text: "Refuel with a balanced lunch. Don't forget your carbs for energy." });
    }

    const [reminderH] = appState.user.reminderTime.split(':').map(Number);
    if (hour === reminderH - 1) {
      newReminders.push({ time: 'Pre-Workout', text: 'Your workout is in an hour. Have a light snack like a banana.' });
    }
    if (hour >= reminderH && hour < reminderH + 2) {
      newReminders.push({ time: 'Workout Time!', text: `It's time for your ${todaysWorkout?.name || 'workout'}. Go crush it!` });
    }

    if (newReminders.length === 0) {
      newReminders.push({ time: 'Stay Hydrated', text: 'Remember to drink water throughout the day.' });
    }

    setReminders(newReminders);
  };

  const handleCheckin = () => {
    onCheckin();
    toast.success("Great job checking in! Keep that streak going! 🔥");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="lg:col-span-3 md:col-span-2 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Today's Focus: <span className="text-primary">{todaysWorkout?.name || 'Rest Day'}</span>
            </h2>
            <p className="text-muted-foreground">Let's make today count, {appState.user.name}!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleCheckin}
          disabled={isCheckedIn}
          variant={isCheckedIn ? "secondary" : "default"}
          className={`text-lg ${!isCheckedIn && "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
          size="lg"
        >
          {isCheckedIn ? '✅ Checked-in Today!' : '💪 Check-in at Gym'}
        </Button>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">Workout Streak</h3>
        <div className="flex items-center text-5xl font-bold text-accent">
          <span className="text-6xl mr-2">🔥</span>
          <span>{appState.workoutStreak}</span>
        </div>
        <p className="text-muted-foreground mt-1">days in a row!</p>
      </Card>

      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Reminders</h3>
        <div className="space-y-3">
          {reminders.map((reminder, idx) => (
            <div key={idx} className="bg-muted p-3 rounded-lg flex items-center">
              <span className="font-bold text-accent mr-3 w-24">{reminder.time}</span>
              <span className="text-sm">{reminder.text}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Motivation</h3>
        <div className="p-4 bg-primary/10 text-primary rounded-lg min-h-[120px] flex items-center justify-center">
          {isLoadingMotivation ? (
            <div className="animate-pulse">Loading motivation...</div>
          ) : (
            <p className="text-center">{motivation}</p>
          )}
        </div>
      </Card>

      <Card className="lg:col-span-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Nutrition Goals</h3>
        <div className="space-y-4">
          <NutritionBar 
            label="Calories"
            current={appState.nutrition.calories}
            goal={appState.nutrition.calorieGoal}
            unit="kcal"
          />
          <NutritionBar 
            label="Protein"
            current={appState.nutrition.protein}
            goal={appState.nutrition.proteinGoal}
            unit="g"
            color="primary"
          />
        </div>
      </Card>

      <div className="lg:col-span-4">
        <WeightChart 
          labels={appState.weightHistory.labels}
          data={appState.weightHistory.data}
        />
      </div>
    </div>
  );
};

export default Dashboard;
