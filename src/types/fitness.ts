export interface Workout {
  day: string;
  name: string;
  exercises: string[];
  completed: boolean;
  checkinDate: string | null;
}

export interface User {
  name: string;
  dob: string;
  initialHeight: number;
  currentHeight: number;
  initialWeight: number;
  currentWeight: number;
  goals: {
    primary: string[];
    targetWeight: string;
    targetHeight: string;
  };
  reminderTime: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  calorieGoal: number;
  proteinGoal: number;
}

export interface WeightHistory {
  labels: string[];
  data: number[];
}

export interface AppState {
  user: User;
  workoutPlan: Workout[];
  workoutStreak: number;
  nutrition: Nutrition;
  weightHistory: WeightHistory;
  lastVisitDate: string | null;
  lastWeekReset: string | null; // Track when the week was last reset
}
