const PILLS = [
  { label: "All",              status: "",           priority: "" },
  { label: "Pending",          status: "Pending",    priority: "" },
  { label: "In Progress",      status: "In Progress",priority: "" },
  { label: "Completed",        status: "Completed",  priority: "" },
  { label: "High Priority",    status: "",           priority: "High"   },
  { label: "Medium Priority",  status: "",           priority: "Medium" },
  { label: "Low Priority",     status: "",           priority: "Low"    },
];

const PILL_COLORS = {
  "All":             "border-blue-500 bg-blue-500/10 text-blue-400",
  "Pending":         "border-amber-500 bg-amber-500/10 text-amber-400",
  "In Progress":     "border-violet-500 bg-violet-500/10 text-violet-400",
  "Completed":       "border-emerald-500 bg-emerald-500/10 text-emerald-400",
  "High Priority":   "border-red-500 bg-red-500/10 text-red-400",
  "Medium Priority": "border-amber-500 bg-amber-500/10 text-amber-400",
  "Low Priority":    "border-emerald-500 bg-emerald-500/10 text-emerald-400",
};

const INACTIVE = "border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]";

const INPUT = "bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors h-9";

export default function FilterBar({ filters, setFilters }) {
  const active = PILLS.find((p) => p.status === filters.status && p.priority === filters.priority) || PILLS[0];
  const hasFilters = filters.search || filters.assignedTo || filters.status || filters.priority;

  return (
    <div className="space-y-3">
      {/* Search inputs */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">⌕</span>
          <input type="text" value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search by title..." className={`${INPUT} pl-8 w-full`} />
        </div>
        <div className="relative flex-1 min-w-36">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs">👤</span>
          <input type="text" value={filters.assignedTo}
            onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}
            placeholder="Search assignee..." className={`${INPUT} pl-8 w-full`} />
        </div>
        {hasFilters && (
          <button onClick={() => setFilters({ search: "", assignedTo: "", status: "", priority: "" })}
            className={`${INPUT} px-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap`}>
            Clear ×
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {PILLS.map((pill) => {
          const isActive = active.label === pill.label;
          return (
            <button key={pill.label}
              onClick={() => setFilters((f) => ({ ...f, status: pill.status, priority: pill.priority }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${isActive ? PILL_COLORS[pill.label] : INACTIVE}`}>
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
