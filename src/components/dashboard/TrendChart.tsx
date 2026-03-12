import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MergedRecord } from "@/hooks/useDashboardData";
import { useMemo } from "react";
import { buildTrendSeries } from "@/lib/calculations";

interface TrendChartProps {
  data: MergedRecord[];
}

const TrendChart = ({ data }: TrendChartProps) => {
  const chartData = useMemo(() => {
    return buildTrendSeries(data);
  }, [data]);

  return (
    <div className="kpi-card">
      <div className="mb-1">
        <h3 className="dashboard-section-title">Uncovered Loads Over Time</h3>
        <p className="text-xs text-muted-foreground mt-0.5">By target delivery date</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 20, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 46%)" }}
            axisLine={{ stroke: "hsl(220, 13%, 91%)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(220, 13%, 91%)",
              borderRadius: "8px",
              fontSize: 12,
              boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(152, 55%, 36%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(152, 55%, 36%)", stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "hsl(152, 55%, 36%)", stroke: "white", strokeWidth: 2 }}
            name="Uncovered Loads"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
