import { useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import KpiCards from "@/components/dashboard/KpiCards";
import DivisionFilter from "@/components/dashboard/DivisionFilter";
import StateBarChart from "@/components/dashboard/StateBarChart";
import StateMap from "@/components/dashboard/StateMap";
import WeightByStateChart from "@/components/dashboard/WeightByStateChart";
import TrendChart from "@/components/dashboard/TrendChart";
import DataTable from "@/components/dashboard/DataTable";
import { Loader2, Globe2, Github } from "lucide-react";
import { calculateKpis } from "@/lib/calculations";
import ChatAssistant from "@/components/ChatAssistant";

const datasetNarrativeContext = `All Divisions
838 uncovered loads
35,658,641 lbs total weight
100.0% uncovered load rate
42,552 lbs average weight per load
Destination states by load count (approx): ON ~115, MN ~110, NY ~65, NB ~50, QC ~40, AB ~35, NJ ~35, NC ~33, TX ~31, OH ~30, VA ~28, PA ~27, FL ~20, GA ~20, NS ~18
Total weight by state (highest first): ON ~4.8M lbs, MN ~4.5M lbs, NY ~3.0M lbs, NB ~2.8M lbs, QC ~1.7M lbs, NJ ~1.5M lbs, AB ~1.4M lbs, NC ~1.4M lbs, TX ~1.4M lbs, OH ~1.3M lbs
Trend: spike mid-March (~130 loads/day) then rapid decline

Canada Foodservice
39 uncovered loads
1,720,946 lbs total weight
4.7% uncovered load rate
44,127 lbs average weight per load
Destination states by load count: QC ~20, ON ~17, BC ~1, AB ~1
Total weight by state: QC ~1.0M lbs, ON ~700k lbs, BC ~30k lbs, AB ~20k lbs
Trend: small spikes mid-March (~9 loads/day) then stabilizes near 1-2/day

Canada Retail
25 uncovered loads
897,968 lbs total weight
3.0% uncovered load rate
35,919 lbs average weight per load
Destination states by load count: ON ~15, QC ~7, AB ~2, MB ~1
Total weight by state: ON ~600k lbs, QC ~300k lbs, AB ~70k lbs
Trend: one moderate spike (~9 loads/day) then decline

National Accounts
276 uncovered loads
11,568,317 lbs total weight
32.9% uncovered load rate
41,914 lbs average weight per load
Destination states by load count: OH ~30, NY ~27, TX ~25, VA ~22, NC ~22, PA ~20, GA ~17, MI ~16, FL ~15, IL ~14, AR ~11, ON ~10, MD ~8, MO ~7, KY ~6
Total weight by state: OH ~4.7M lbs, NY ~4.3M lbs, TX ~4.1M lbs, NC ~3.1M lbs, VA ~3.0M lbs, PA ~2.7M lbs, GA ~2.3M lbs
Trend: strong spike late March (~35 loads/day) then gradual decline

Unassigned
342 uncovered loads
15,265,797 lbs total weight
40.8% uncovered load rate
44,637 lbs average weight per load
Destination states by load count: MN ~110, ON ~70, NB ~50, AR ~35, NJ ~25, NS ~20, QC ~18, BC ~6, TX ~5, FL ~4, CA ~3, MD ~2
Total weight by state: MN ~4.5M lbs, ON ~3.3M lbs, NB ~2.6M lbs, AB ~1.5M lbs, NJ ~1.2M lbs, NS ~900k lbs, QC ~600k lbs
Trend: large spike late March (~75 loads/day) then sharp decline

US Foodservice
124 uncovered loads
5,184,507 lbs total weight
14.8% uncovered load rate
41,811 lbs average weight per load
Destination states by load count: NY ~37, WI ~13, MA ~12, CA ~10, NJ ~9, PA ~5, VT ~5, NC ~4, MD ~4, OK ~3, WA ~3, GA ~2, TX ~2, CT ~2, ME ~2
Total weight by state: NY ~2.9M lbs, WI ~1.2M lbs, MA ~1.1M lbs, CA ~900k lbs, NJ ~850k lbs
Trend: early spike (~23 loads/day) mid-March then gradual decline

US Retail
32 uncovered loads
1,021,106 lbs total weight
3.8% uncovered load rate
31,910 lbs average weight per load
Destination states by load count: NC ~10, SC ~8, ME ~5, VA ~3, NY ~2, PA ~2, ND ~1, VT ~1
Total weight by state: NC ~300k lbs, SC ~230k lbs, ME ~160k lbs, VA ~120k lbs, PA ~80k lbs, NY ~70k lbs
Trend: gradual rise to ~10 loads/day then steady decline`;

const Index = () => {
  const { mergedData, divisions, loading } = useDashboardData();
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!selectedDivision) return mergedData;
    return mergedData.filter((d) => d.salesDivisionName === selectedDivision);
  }, [mergedData, selectedDivision]);

  const { totalLoads, totalWeight, avgWeight, uncoveredRate } = useMemo(
    () => calculateKpis(filteredData, mergedData),
    [filteredData, mergedData]
  );

  const assistantContext = useMemo(
    () => ({
      narrative: datasetNarrativeContext,
    }),
    []
  );

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
      <header className="border-b bg-card px-6 pt-6 pb-4">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Executive Overview: Uncovered Transport Loads
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                By Region & Sales Division
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href="https://www.tylertravis.ca"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary font-medium"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>tylertravis.ca</span>
              </a>
              <a
                href="https://github.com/tylertraviss"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary font-medium"
              >
                <Github className="w-3.5 h-3.5" />
                <span>/tylertraviss</span>
              </a>
            </div>
          </div>
          <ChatAssistant context={assistantContext} />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-12 pb-8 space-y-8">
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
