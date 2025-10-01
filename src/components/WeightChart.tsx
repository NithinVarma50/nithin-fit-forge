import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

interface WeightChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

const WeightChart = ({ labels, data, title = "Weight Progress" }: WeightChartProps) => {
  const chartData = labels.map((label, index) => ({
    name: label,
    weight: data[index],
  }));

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="hsl(var(--accent))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--accent))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default WeightChart;
