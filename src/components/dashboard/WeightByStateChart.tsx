import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MergedRecord } from "@/hooks/useDashboardData";
import { useMemo } from "react";

interface WeightByStateChartProps {
  data: MergedRecord[];
}

const WeightByStateChart = ({ data }: WeightByStateChartProps) => {
  const chartData = useMemo(() => {
    const stateMap = new Map<string, number>();
    data.forEach((r) => {
      const state = r.destState || "Unknown";
      stateMap.set(state, (stateMap.get(state) || 0) + r.weight);
    });

    return Array.from(stateMap.entries())
      .map(([state, weight]) => ({ state, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 12);
  }, [data]);

  return (
    <div className="kpi-card">
      <div className="mb-1">
        <h3 className="dashboard-section-title">Total Weight by State</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Business impact of uncovered loads</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="state"
            tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(220, 13%, 91%)",
              borderRadius: "8px",
              fontSize: 12,
              boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.08)",
            }}
            formatter={(value: number) => [`${value.toLocaleString()} lbs`, "Weight"]}
          />
          <Bar dataKey="weight" fill="hsl(152, 45%, 48%)" radius={[0, 4, 4, 0]} name="Weight (lbs)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightByStateChart;
