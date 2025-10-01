import { Progress } from "@/components/ui/progress";

interface NutritionBarProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color?: "accent" | "primary";
}

const NutritionBar = ({ label, current, goal, unit, color = "accent" }: NutritionBarProps) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium">{label}</span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(current)} / {goal} {unit}
        </span>
      </div>
      <Progress value={percentage} className={`h-4 ${color === "primary" ? "[&>div]:bg-primary" : ""}`} />
    </div>
  );
};

export default NutritionBar;
