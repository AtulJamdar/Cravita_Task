const STATUS_CONFIG = {
  "Pending":     { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10"   },
  "In Progress": { dot: "bg-violet-400",  text: "text-violet-400",  bg: "bg-violet-400/10"  },
  "Completed":   { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10" },
};

const PRIORITY_CONFIG = {
  "High":   { text: "text-red-400",     bg: "bg-red-400/10"     },
  "Medium": { text: "text-amber-400",   bg: "bg-amber-400/10"   },
  "Low":    { text: "text-emerald-400", bg: "bg-emerald-400/10" },
};

export function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.text} ${c.bg}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0 ${status === "In Progress" ? "animate-pulse-dot" : ""}`}
      />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const c = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG["Medium"];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.text} ${c.bg}`}>
      {priority}
    </span>
  );
}
