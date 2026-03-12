import { Package, Weight, TrendingDown, BarChart3 } from "lucide-react";

interface KpiCardsProps {
  totalLoads: number;
  totalWeight: number;
  uncoveredRate: number;
  avgWeight: number;
}

const cards = [
  {
    key: "loads",
    label: "Total Uncovered Loads",
    icon: Package,
    getValue: (p: KpiCardsProps) => p.totalLoads.toLocaleString(),
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    key: "weight",
    label: "Total Weight",
    icon: Weight,
    getValue: (p: KpiCardsProps) => `${p.totalWeight.toLocaleString()} lbs`,
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    key: "rate",
    label: "Uncovered Load Rate",
    icon: TrendingDown,
    getValue: (p: KpiCardsProps) => `${(p.uncoveredRate ?? 0).toFixed(1)}%`,
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    key: "avg",
    label: "Avg Weight per Load",
    icon: BarChart3,
    getValue: (p: KpiCardsProps) => `${p.avgWeight.toLocaleString()} lbs`,
    color: "text-primary",
    bgColor: "bg-accent",
  },
];

const KpiCards = (props: KpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="kpi-card">
          <div className="flex items-center justify-between mb-3">
            <p className="kpi-label">{card.label}</p>
            <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <p className="kpi-value">{card.getValue(props)}</p>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
