const CONFIG = {
  total:      { label: "Total Tasks",  icon: "◈", iconBg: "bg-blue-500/10",    iconColor: "text-blue-400"  },
  pending:    { label: "Pending",      icon: "◷", iconBg: "bg-amber-500/10",   iconColor: "text-amber-400" },
  inProgress: { label: "In Progress",  icon: "↺", iconBg: "bg-violet-500/10",  iconColor: "text-violet-400"},
  completed:  { label: "Completed",    icon: "✓", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400"},
};

export default function StatCard({ type, value }) {
  const { label, icon, iconBg, iconColor } = CONFIG[type];
  return (
    <div className="animate-fade-up flex-1 min-w-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center text-xl ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none">{value}</p>
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
