import type { MergedRecord } from "@/hooks/useDashboardData";
import { useMemo } from "react";

interface DataTableProps {
  data: MergedRecord[];
}

const DataTable = ({ data }: DataTableProps) => {
  const rows = useMemo(() => data.slice(0, 50), [data]);

  return (
    <div className="kpi-card overflow-hidden">
      <h3 className="dashboard-section-title mb-4">
        Load Details (Top 50)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">Reference</th>
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">Status</th>
              <th className="px-3 py-2 text-right font-semibold text-secondary-foreground">Weight</th>
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">Origin</th>
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">Destination</th>
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">State</th>
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">Division</th>
              <th className="px-3 py-2 text-left font-semibold text-secondary-foreground">Delivery Target</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-3 py-2 font-medium">{r.primaryReference}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    r.status === "Booked" ? "bg-primary/10 text-primary" :
                    r.status === "Tendered" ? "bg-accent/15 text-accent" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{r.weight.toLocaleString()}</td>
                <td className="px-3 py-2">{r.originCity}, {r.originState}</td>
                <td className="px-3 py-2">{r.destCity}</td>
                <td className="px-3 py-2 font-medium">{r.destState}</td>
                <td className="px-3 py-2">{r.salesDivisionName}</td>
                <td className="px-3 py-2 tabular-nums">{r.targetDeliveryEarly?.split(" ")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
