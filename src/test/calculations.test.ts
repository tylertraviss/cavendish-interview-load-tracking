import { describe, it, expect } from "vitest";
import {
  calculateKpis,
  buildTrendSeries,
  buildStateCountSeries,
  buildWeightByStateSeries,
} from "@/lib/calculations";
import type { MergedRecord } from "@/hooks/useDashboardData";

const baseRecord: MergedRecord = {
  createDate: "",
  primaryReference: "",
  status: "",
  weight: 0,
  targetShipEarly: "",
  targetShipLate: "",
  targetDeliveryEarly: "",
  targetDeliveryLate: "",
  originCode: "",
  originName: "",
  originCity: "",
  originState: "",
  originZip: "",
  originCtry: "",
  destCode: "",
  destCity: "",
  destName: "",
  destState: "",
  destZip: "",
  destCtry: "",
  salesDivisionName: "",
  customerGroupDescription: "",
};

describe("calculateKpis", () => {
  it("computes totals, averages, and uncovered rate correctly", () => {
    const all: MergedRecord[] = [
      { ...baseRecord, primaryReference: "A", weight: 100 },
      { ...baseRecord, primaryReference: "B", weight: 300 },
      { ...baseRecord, primaryReference: "C", weight: 600 },
      { ...baseRecord, primaryReference: "D", weight: 0 },
    ];

    const filtered: MergedRecord[] = [
      all[0], // 100
      all[2], // 600
    ];

    const result = calculateKpis(filtered, all);

    expect(result.totalLoads).toBe(2);
    expect(result.totalWeight).toBe(700);
    expect(result.avgWeight).toBe(350);
    // 2 / 4 = 0.5 -> 50%
    expect(result.uncoveredRate).toBeCloseTo(50);
  });

  it("handles empty data safely", () => {
    const result = calculateKpis([], []);
    expect(result.totalLoads).toBe(0);
    expect(result.totalWeight).toBe(0);
    expect(result.avgWeight).toBe(0);
    expect(result.uncoveredRate).toBe(0);
  });
});

describe("buildTrendSeries", () => {
  it("groups by date and uses delivery, fallback to ship and create date", () => {
    const data: MergedRecord[] = [
      { ...baseRecord, targetDeliveryEarly: "2024-01-02 10:00", createDate: "2024-01-01 09:00" },
      { ...baseRecord, targetDeliveryEarly: "2024-01-02 12:00", createDate: "2024-01-01 09:00" },
      { ...baseRecord, targetDeliveryEarly: "", targetShipEarly: "2024-01-01 08:00" },
      { ...baseRecord, targetDeliveryEarly: "", targetShipEarly: "", createDate: "2023-12-31 18:00" },
    ];

    const series = buildTrendSeries(data);

    expect(series).toEqual([
      { date: "2023-12-31", count: 1 },
      { date: "2024-01-01", count: 1 },
      { date: "2024-01-02", count: 2 },
    ]);
  });
});

describe("buildStateCountSeries", () => {
  it("counts loads per destination state and sorts descending", () => {
    const data: MergedRecord[] = [
      { ...baseRecord, destState: "NY" },
      { ...baseRecord, destState: "NY" },
      { ...baseRecord, destState: "CA" },
      { ...baseRecord, destState: "" }, // should be bucketed as Unknown
    ];

    const series = buildStateCountSeries(data);

    expect(series).toEqual([
      { state: "NY", count: 2 },
      { state: "CA", count: 1 },
      { state: "Unknown", count: 1 },
    ]);
  });

  it("applies the limit", () => {
    const data: MergedRecord[] = [];
    for (let i = 0; i < 20; i++) {
      data.push({ ...baseRecord, destState: `S${i}` });
    }

    const series = buildStateCountSeries(data, 5);
    expect(series).toHaveLength(5);
  });
});

describe("buildWeightByStateSeries", () => {
  it("aggregates weight per state and sorts by total weight", () => {
    const data: MergedRecord[] = [
      { ...baseRecord, destState: "TX", weight: 1000 },
      { ...baseRecord, destState: "TX", weight: 4000 },
      { ...baseRecord, destState: "FL", weight: 2500 },
      { ...baseRecord, destState: "", weight: 500 }, // Unknown
    ];

    const series = buildWeightByStateSeries(data);

    expect(series).toEqual([
      { state: "TX", weight: 5000 },
      { state: "FL", weight: 2500 },
      { state: "Unknown", weight: 500 },
    ]);
  });

  it("applies the limit", () => {
    const data: MergedRecord[] = [];
    for (let i = 0; i < 20; i++) {
      data.push({ ...baseRecord, destState: `S${i}`, weight: i * 10 });
    }

    const series = buildWeightByStateSeries(data, 7);
    expect(series).toHaveLength(7);
  });
});

