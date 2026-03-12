import { useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import KpiCards from "@/components/dashboard/KpiCards";
import DivisionFilter from "@/components/dashboard/DivisionFilter";
import StateBarChart from "@/components/dashboard/StateBarChart";
import StateMap from "@/components/dashboard/StateMap";
import WeightByStateChart from "@/components/dashboard/WeightByStateChart";
import TrendChart from "@/components/dashboard/TrendChart";
import DataTable from "@/components/dashboard/DataTable";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { mergedData, divisions, loading } = useDashboardData();
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!selectedDivision) return mergedData;
    return mergedData.filter((d) => d.salesDivisionName === selectedDivision);
  }, [mergedData, selectedDivision]);

  const totalLoads = filteredData.length;
  const totalWeight = useMemo(
    () => filteredData.reduce((sum, d) => sum + d.weight, 0),
    [filteredData]
  );
  const avgWeight = totalLoads > 0 ? Math.round(totalWeight / totalLoads) : 0;
  // Uncovered rate: assume all loaded records are uncovered out of a nominal baseline
  const uncoveredRate = mergedData.length > 0 ? (filteredData.length / mergedData.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Executive Overview: Uncovered Transport Loads
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              By Region & Sales Division
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-muted rounded-full px-4 py-1.5">
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {mergedData.length.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">total records</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Division Filter */}
        <DivisionFilter
          divisions={divisions}
          selected={selectedDivision}
          onSelect={setSelectedDivision}
        />

        {/* KPI Cards */}
        <KpiCards
          totalLoads={totalLoads}
          totalWeight={totalWeight}
          uncoveredRate={uncoveredRate}
          avgWeight={avgWeight}
        />

        {/* Main Charts: Map + Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: 420 }}>
          <div className="lg:col-span-3">
            <StateMap data={filteredData} />
          </div>
          <div className="lg:col-span-2">
            <StateBarChart data={filteredData} />
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightByStateChart data={filteredData} />
          <TrendChart data={filteredData} />
        </div>

        {/* Data Table */}
        <DataTable data={filteredData} />
      </main>

      <footer className="border-t bg-card py-4 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Cavendish Farms — Transportation Analytics Dashboard
        </p>
      </footer>
    </div>
  );
};

export default Index;
