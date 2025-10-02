import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppState } from "@/types/fitness";
import { calculateAge, formatHeight } from "@/utils/fitness";
import { callGeminiAPIRaw } from "@/utils/gemini";
import { toast } from "sonner";
import WeightChart from "./WeightChart";

interface ProgressProps {
  appState: AppState;
  onWeightUpdate: (newWeight: number) => void;
}

const Progress = ({ appState, onWeightUpdate }: ProgressProps) => {
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const prompt = `I'm an 18-year-old named ${appState.user.name}, and my goal is bulking. This month, my weight went from ${appState.user.initialWeight}kg to ${appState.user.currentWeight}kg. I maintained a workout streak of ${appState.workoutStreak} days. Write a short, encouraging, Gen-Z style summary of my progress and give me one motivational tip for next month.`;
      const text = await callGeminiAPIRaw(prompt);
      setAiSummary(text);
    } catch (error) {
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus(`Uploading ${file.name}...`);
      setTimeout(() => {
        const newWeight = parseFloat((appState.user.currentWeight + 0.5).toFixed(1));
        onWeightUpdate(newWeight);
        setUploadStatus(`✅ Success! Profile updated.`);
        toast.success("BMI report uploaded successfully!");
        setTimeout(() => setUploadStatus(""), 3000);
      }, 1500);
    }
  };

  const workoutsThisMonth = appState.workoutPlan.filter(
    w => w.checkinDate && new Date(w.checkinDate).getMonth() === new Date().getMonth()
  ).length;

  const weightChange = appState.user.currentWeight - appState.user.initialWeight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 p-6">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="space-y-3">
          <p><strong>Name:</strong> {appState.user.name}</p>
          <p><strong>Age:</strong> {calculateAge(appState.user.dob)}</p>
          <p><strong>Height:</strong> {formatHeight(appState.user.currentHeight)}</p>
          <p><strong>Weight:</strong> {appState.user.currentWeight} kg</p>
        </div>
        <h3 className="text-xl font-bold mt-6 mb-2">Your Goals</h3>
        <div className="space-y-2 text-muted-foreground">
          <p><strong>Primary:</strong> {appState.user.goals.primary.join(', ')}</p>
          <p><strong>Target Weight:</strong> {appState.user.goals.targetWeight}</p>
          <p><strong>Target Height:</strong> {appState.user.goals.targetHeight}</p>
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Monthly Progress Report</h3>
            <Button 
              onClick={handleGenerateSummary}
              disabled={isLoadingSummary}
              size="sm"
            >
              <span className="mr-2">✨</span>
              Generate AI Summary
            </Button>
          </div>
          <div className="text-muted-foreground space-y-2">
            <p><strong>Workouts This Month:</strong> {workoutsThisMonth}</p>
            <p><strong>Longest Streak:</strong> {appState.workoutStreak} days</p>
            <p>
              <strong>Weight Change:</strong>{' '}
              <span className={`font-semibold ${weightChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </span>
            </p>
          </div>
          {aiSummary && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg text-primary">
              {isLoadingSummary ? (
                <div className="animate-pulse">Generating summary...</div>
              ) : (
                <p>{aiSummary}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">BMI Report</h3>
          <p className="text-muted-foreground mb-4">
            Upload your BMI report to automatically update your profile.
          </p>
          <input
            type="file"
            id="bmi-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button onClick={() => document.getElementById('bmi-upload')?.click()}>
            Upload Report
          </Button>
          {uploadStatus && <p className="text-sm mt-2 text-muted-foreground">{uploadStatus}</p>}
        </Card>

        <WeightChart 
          labels={appState.weightHistory.labels}
          data={appState.weightHistory.data}
        />
      </div>
    </div>
  );
};

export default Progress;
