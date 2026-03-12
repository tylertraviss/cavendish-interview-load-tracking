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
import { buildStateCountSeries } from "@/lib/calculations";

interface StateBarChartProps {
  data: MergedRecord[];
}

const StateBarChart = ({ data }: StateBarChartProps) => {
  const chartData = useMemo(() => {
    return buildStateCountSeries(data);
  }, [data]);

  return (
    <div className="kpi-card h-full flex flex-col">
      <div className="mb-1">
        <h3 className="dashboard-section-title">Loads by Destination State</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Sorted by volume, top 15</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: -8, bottom: 36 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis
              dataKey="state"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }}
              interval={0}
              axisLine={{ stroke: "hsl(220, 13%, 91%)" }}
              tickLine={false}
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
              cursor={{ fill: "hsl(152, 40%, 94%)", radius: 4 }}
            />
            <Bar
              dataKey="count"
              fill="hsl(152, 55%, 36%)"
              radius={[4, 4, 0, 0]}
              name="Uncovered Loads"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StateBarChart;
