import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppState } from "@/types/fitness";
import { getTodayName, getTodayDate, saveAppState, loadAppState } from "@/utils/fitness";
import Dashboard from "@/components/Dashboard";
import Workouts from "@/components/Workouts";
import Nutrition from "@/components/Nutrition";
import Progress from "@/components/Progress";
import AIHub from "@/pages/AIHub";
import ShareButton from "@/components/ShareButton";
import ShareImage from "@/components/ShareImage";
import { useSharing } from "@/hooks/useSharing";

const Index = () => {
  const [appState, setAppState] = useState<AppState>({
    user: {
      name: 'Nithin',
      dob: '2007-05-04',
      initialHeight: 167.64,
      currentHeight: 167.64,
      initialWeight: 58,
      currentWeight: 58,
      goals: {
        primary: ['Bulking', 'Flexibility', 'Height Maximization'],
        targetWeight: '68-75 kg',
        targetHeight: "5'8\"-5'9\"",
      },
      reminderTime: "17:30"
    },
    workoutPlan: [
      { day: 'Sunday', name: 'Active Recovery & Height', exercises: ['Walking', 'Stretching', 'Dead Hangs'], completed: false, checkinDate: null },
      { day: 'Monday', name: 'Push Day (Strength)', exercises: ['Dumbbell Bench Press', 'Dumbbell Incline Press', 'Dumbbell Overhead Press'], completed: false, checkinDate: null },
      { day: 'Tuesday', name: 'Pull Day (Strength)', exercises: ['Pull-Ups', 'Bent-Over Dumbbell Rows', 'Bicep Curls'], completed: false, checkinDate: null },
      { day: 'Wednesday', name: 'Leg Day (Strength)', exercises: ['Goblet Squats', 'Romanian Deadlifts', 'Walking Lunges'], completed: false, checkinDate: null },
      { day: 'Thursday', name: 'Upper Body (Hypertrophy)', exercises: ['Push-Ups', 'Single-Arm Rows', 'Lateral Raises'], completed: false, checkinDate: null },
      { day: 'Friday', name: 'Core & Full Body', exercises: ['Plank', 'Supermans', 'Dumbbell Thrusters'], completed: false, checkinDate: null },
      { day: 'Saturday', name: 'Full Body & Skipping HIIT', exercises: ['Dumbbell Thrusters', 'Renegade Rows', 'Skipping'], completed: false, checkinDate: null }
    ],
    workoutStreak: 0,
    nutrition: {
      calories: 0,
      protein: 0,
      calorieGoal: 2800,
      proteinGoal: 115
    },
    weightHistory: {
      labels: ['Start'],
      data: [58]
    },
    lastVisitDate: null
  });

  // Sharing configuration
  const shareTitle = "Fit Forge - My Fitness Journey";
  const shareDescription = `Track my fitness progress with ${appState.user.name}'s personalized workout and nutrition plan. Join me on this fitness journey!`;
  
  // Initialize sharing with dynamic content
  const { platform, updateSharing } = useSharing({
    title: shareTitle,
    description: shareDescription,
    autoDetect: true
  });

  // Load saved state on initial render
  useEffect(() => {
    const savedState = loadAppState();
    if (savedState) {
      setAppState(savedState);
    }
    resetDailyStatus();
  }, []);
  
  // Save state whenever it changes
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const resetDailyStatus = () => {
    const todayStr = getTodayDate();
    setAppState(prev => {
      if (prev.lastVisitDate !== todayStr) {
        const updatedPlan = prev.workoutPlan.map(w => ({
          ...w,
          completed: w.checkinDate === todayStr ? w.completed : false
        }));

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWorkoutDate = prev.workoutPlan
          .filter(w => w.checkinDate)
          .map(w => new Date(w.checkinDate!))
          .sort((a, b) => b.getTime() - a.getTime())[0];

        const newStreak = lastWorkoutDate && lastWorkoutDate < yesterday ? 0 : prev.workoutStreak;

        return {
          ...prev,
          workoutPlan: updatedPlan,
          workoutStreak: newStreak,
          nutrition: {
            ...prev.nutrition,
            calories: 0,
            protein: 0
          },
          lastVisitDate: todayStr
        };
      }
      return prev;
    });
  };

  const handleCheckin = () => {
    const todayName = getTodayName();
    const todayDate = getTodayDate();
    setAppState(prev => {
      const updatedPlan = prev.workoutPlan.map(w => {
        if (w.day === todayName && !w.completed) {
          return { ...w, completed: true, checkinDate: todayDate };
        }
        return w;
      });
      return {
        ...prev,
        workoutPlan: updatedPlan,
        workoutStreak: prev.workoutStreak + 1
      };
    });
  };

  const [nutritionHistory, setNutritionHistory] = useState<Array<{ calories: number; protein: number }>>([]);

  const handleMealAdd = (calories: number, protein: number) => {
    setAppState(prev => {
      // Save current state to history before adding new meal
      setNutritionHistory(history => [...history, { calories: prev.nutrition.calories, protein: prev.nutrition.protein }]);
      
      return {
        ...prev,
        nutrition: {
          ...prev.nutrition,
          calories: prev.nutrition.calories + calories,
          protein: prev.nutrition.protein + protein
        }
      };
    });
  };

  const handleResetNutrition = () => {
    setAppState(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        calories: 0,
        protein: 0
      }
    }));
    setNutritionHistory([]);
  };

  const handleUndoMeal = () => {
    if (nutritionHistory.length > 0) {
      const previousState = nutritionHistory[nutritionHistory.length - 1];
      setAppState(prev => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          calories: previousState.calories,
          protein: previousState.protein
        }
      }));
      setNutritionHistory(history => history.slice(0, -1));
    }
  };

  const handleReminderSet = (time: string) => {
    setAppState(prev => ({
      ...prev,
      user: { ...prev.user, reminderTime: time }
    }));
  };

  const handleWeightUpdate = (newWeight: number) => {
    setAppState(prev => ({
      ...prev,
      user: { ...prev.user, currentWeight: newWeight },
      weightHistory: {
        labels: [...prev.weightHistory.labels, `Month ${prev.weightHistory.labels.length}`],
        data: [...prev.weightHistory.data, newWeight]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic sharing meta tags */}
      <ShareImage 
        title={shareTitle}
        description={shareDescription}
        platform={platform}
      />
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {appState.user.name}'s Fitness Tracker
          </h1>
          <div className="flex items-center gap-4">
            <ShareButton 
              title={shareTitle}
              description={shareDescription}
              variant="outline"
              size="sm"
            />
            <Avatar className="w-12 h-12 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {appState.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="ai-hub">AI Hub</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard appState={appState} onCheckin={handleCheckin} />
          </TabsContent>

          <TabsContent value="workouts">
            <Workouts appState={appState} onReminderSet={handleReminderSet} />
          </TabsContent>

          <TabsContent value="nutrition">
            <Nutrition 
              appState={appState} 
              onMealAdd={handleMealAdd} 
              onResetNutrition={handleResetNutrition}
              onUndoMeal={handleUndoMeal}
              canUndo={nutritionHistory.length > 0}
            />
          </TabsContent>

          <TabsContent value="ai-hub">
            <AIHub appState={appState} />
          </TabsContent>

          <TabsContent value="progress">
            <Progress appState={appState} onWeightUpdate={handleWeightUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
