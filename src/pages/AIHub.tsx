import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppState } from "@/types/fitness";
import AICoach from "@/components/AICoach";
import AIWorkoutGenerator from "@/components/AIWorkoutGenerator";
import WeeklyMealPlanner from "@/components/WeeklyMealPlanner";

interface AIHubProps {
  appState: AppState;
}

const AIHub = ({ appState }: AIHubProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">🤖 AI Fitness Hub</h2>
        <p className="text-muted-foreground">
          Powered by advanced AI to optimize your bulking journey
        </p>
      </div>

      <Tabs defaultValue="coach" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coach">AI Coach Chat</TabsTrigger>
          <TabsTrigger value="workout">Workout Generator</TabsTrigger>
          <TabsTrigger value="meals">Meal Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="coach">
          <AICoach appState={appState} />
        </TabsContent>

        <TabsContent value="workout">
          <AIWorkoutGenerator appState={appState} />
        </TabsContent>

        <TabsContent value="meals">
          <WeeklyMealPlanner appState={appState} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIHub;
