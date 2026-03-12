import type { MergedRecord } from "@/hooks/useDashboardData";

export interface KpiResults {
  totalLoads: number;
  totalWeight: number;
  avgWeight: number;
  uncoveredRate: number;
}

export function calculateKpis(filteredData: MergedRecord[], allData: MergedRecord[]): KpiResults {
  const totalLoads = filteredData.length;
  const totalWeight = filteredData.reduce((sum, d) => sum + d.weight, 0);
  const avgWeight = totalLoads > 0 ? Math.round(totalWeight / totalLoads) : 0;
  const uncoveredRate = allData.length > 0 ? (filteredData.length / allData.length) * 100 : 0;

  return {
    totalLoads,
    totalWeight,
    avgWeight,
    uncoveredRate,
  };
}

export function buildTrendSeries(data: MergedRecord[]): { date: string; count: number }[] {
  const dateMap = new Map<string, number>();

  data.forEach((r) => {
    const raw = r.targetDeliveryEarly || r.targetShipEarly || r.createDate;
    if (!raw) return;
    const date = raw.split(" ")[0];
    if (!date) return;
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  return Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function buildStateCountSeries(
  data: MergedRecord[],
  limit = 15
): { state: string; count: number }[] {
  const stateMap = new Map<string, number>();

  data.forEach((r) => {
    const state = r.destState || "Unknown";
    stateMap.set(state, (stateMap.get(state) || 0) + 1);
  });

  return Array.from(stateMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function buildWeightByStateSeries(
  data: MergedRecord[],
  limit = 12
): { state: string; weight: number }[] {
  const stateMap = new Map<string, number>();

  data.forEach((r) => {
    const state = r.destState || "Unknown";
    stateMap.set(state, (stateMap.get(state) || 0) + r.weight);
  });

  return Array.from(stateMap.entries())
    .map(([state, weight]) => ({ state, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

