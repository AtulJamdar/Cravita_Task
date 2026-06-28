import { useState } from "react";
import { List } from "./animate-ui/list";
import { Clock } from "./animate-ui/clock";
import { RotateCcw } from "./animate-ui/rotate-ccw";
import { Check } from "./animate-ui/check";
import { Card, CardContent } from "./seraui/card";

const CONFIG = {
  total:      { label: "Total Tasks",  icon: List,      iconBg: "bg-blue-500/10",    iconColor: "text-blue-400"  },
  pending:    { label: "Pending",      icon: Clock,     iconBg: "bg-amber-500/10",   iconColor: "text-amber-400" },
  inProgress: { label: "In Progress",  icon: RotateCcw, iconBg: "bg-violet-500/10",  iconColor: "text-violet-400"},
  completed:  { label: "Completed",    icon: Check,     iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400"},
};

export default function StatCard({ type, value }) {
  const [hovered, setHovered] = useState(false);
  const { label, icon: Icon, iconBg, iconColor } = CONFIG[type];

  return (
    <Card 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden flex-1 min-w-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl py-5 flex items-center gap-4 shadow-sm cursor-default select-none animate-ui-card"
    >
      <CardContent className="flex items-center gap-4 py-0 px-5 w-full">
        <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
          <Icon animate={hovered ? "default" : false} size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none">{value}</p>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-1 uppercase tracking-wider">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
