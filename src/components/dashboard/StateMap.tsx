import type { MergedRecord } from "@/hooks/useDashboardData";
import { useMemo, useState } from "react";

interface StateMapProps {
  data: MergedRecord[];
}

const STATE_POSITIONS: Record<string, { x: number; y: number }> = {
  AL: { x: 73, y: 68 }, AK: { x: 12, y: 85 }, AZ: { x: 28, y: 62 },
  AR: { x: 62, y: 62 }, CA: { x: 15, y: 48 }, CO: { x: 37, y: 48 },
  CT: { x: 90, y: 35 }, DE: { x: 88, y: 42 }, FL: { x: 82, y: 78 },
  GA: { x: 78, y: 68 }, HI: { x: 22, y: 88 }, ID: { x: 25, y: 28 },
  IL: { x: 67, y: 42 }, IN: { x: 72, y: 42 }, IA: { x: 62, y: 36 },
  KS: { x: 52, y: 50 }, KY: { x: 75, y: 52 }, LA: { x: 62, y: 72 },
  ME: { x: 95, y: 18 }, MD: { x: 86, y: 42 }, MA: { x: 92, y: 32 },
  MI: { x: 74, y: 30 }, MN: { x: 58, y: 22 }, MS: { x: 67, y: 68 },
  MO: { x: 62, y: 50 }, MT: { x: 32, y: 18 }, NE: { x: 50, y: 38 },
  NV: { x: 20, y: 42 }, NH: { x: 92, y: 25 }, NJ: { x: 88, y: 38 },
  NM: { x: 32, y: 60 }, NY: { x: 86, y: 28 }, NC: { x: 82, y: 56 },
  ND: { x: 50, y: 18 }, OH: { x: 78, y: 40 }, OK: { x: 52, y: 58 },
  OR: { x: 17, y: 22 }, PA: { x: 84, y: 36 }, RI: { x: 92, y: 34 },
  SC: { x: 82, y: 62 }, SD: { x: 50, y: 28 }, TN: { x: 74, y: 58 },
  TX: { x: 48, y: 70 }, UT: { x: 28, y: 42 }, VT: { x: 90, y: 22 },
  VA: { x: 84, y: 50 }, WA: { x: 18, y: 12 }, WV: { x: 80, y: 48 },
  WI: { x: 66, y: 26 }, WY: { x: 35, y: 32 }, DC: { x: 86, y: 44 },
  AB: { x: 30, y: 8 }, BC: { x: 18, y: 5 }, MB: { x: 52, y: 8 },
  NB: { x: 92, y: 10 }, NL: { x: 98, y: 5 }, NS: { x: 96, y: 12 },
  ON: { x: 72, y: 14 }, PE: { x: 95, y: 8 }, QC: { x: 82, y: 10 },
  SK: { x: 42, y: 8 },
};

interface TooltipInfo {
  state: string;
  count: number;
  weight: number;
  x: number;
  y: number;
}

const StateMap = ({ data }: StateMapProps) => {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const stateData = useMemo(() => {
    const map = new Map<string, { count: number; weight: number; cities: Set<string> }>();
    data.forEach((r) => {
      const state = r.destState;
      if (!state) return;
      if (!map.has(state)) map.set(state, { count: 0, weight: 0, cities: new Set() });
      const entry = map.get(state)!;
      entry.count++;
      entry.weight += r.weight;
      if (r.destCity) entry.cities.add(r.destCity);
    });
    return Array.from(map.entries()).map(([state, d]) => ({
      state,
      count: d.count,
      weight: d.weight,
    }));
  }, [data]);

  const maxCount = Math.max(...stateData.map((s) => s.count), 1);

  return (
    <div className="kpi-card h-full flex flex-col">
      <div className="mb-1">
        <h3 className="dashboard-section-title">Geographic Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Bubble size = load count, color intensity = severity</p>
      </div>
      <div className="relative flex-1 min-h-0" style={{ minHeight: 340 }}>
        <svg
          viewBox="0 0 100 95"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          <rect x="0" y="0" width="100" height="95" fill="hsl(0, 0%, 98%)" rx="2" />

          {stateData.map((s) => {
            const pos = STATE_POSITIONS[s.state];
            if (!pos) return null;
            const ratio = s.count / maxCount;
            const radius = 1.2 + ratio * 3.8;
            const opacity = 0.35 + ratio * 0.65;
            const lightness = 48 - ratio * 18;
            return (
              <g
                key={s.state}
                onMouseEnter={() => setTooltip({ state: s.state, count: s.count, weight: s.weight, x: pos.x, y: pos.y })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={`hsl(152, 55%, ${lightness}%)`}
                  opacity={opacity}
                  stroke="white"
                  strokeWidth="0.4"
                  className="transition-all duration-200"
                />
                <text
                  x={pos.x}
                  y={pos.y + 0.5}
                  textAnchor="middle"
                  fontSize="1.3"
                  fill="white"
                  fontWeight="600"
                  style={{ pointerEvents: "none" }}
                >
                  {s.state}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(3, 88)">
            <circle cx="0" cy="0" r="1" fill="hsl(152, 55%, 48%)" opacity="0.4" />
            <text x="2.5" y="0.5" fontSize="1.5" fill="hsl(220, 10%, 46%)">Few</text>
            <circle cx="12" cy="0" r="2.5" fill="hsl(152, 55%, 30%)" opacity="0.9" />
            <text x="16" y="0.5" fontSize="1.5" fill="hsl(220, 10%, 46%)">Many</text>
          </g>
        </svg>

        {/* Custom Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 bg-card border border-border rounded-lg px-3 py-2 pointer-events-none"
            style={{
              left: `${tooltip.x}%`,
              top: `${tooltip.y}%`,
              transform: "translate(-50%, -120%)",
              boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
            }}
          >
            <p className="text-xs font-semibold text-foreground">{tooltip.state}</p>
            <p className="text-xs text-muted-foreground">{tooltip.count} loads · {tooltip.weight.toLocaleString()} lbs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateMap;
