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

import { Search } from "./animate-ui/search";
import { User } from "./animate-ui/user";
import { X } from "./animate-ui/x";

export default function FilterBar({ filters, setFilters }) {
  const active = PILLS.find((p) => p.status === filters.status && p.priority === filters.priority) || PILLS[0];
  const hasFilters = filters.search || filters.assignedTo || filters.status || filters.priority || filters.sortByDate;

  return (
    <div className="space-y-3">
      {/* Search inputs */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] flex items-center">
            <Search animateOnHover size={16} />
          </span>
          <input type="text" value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search by title..." className={`${INPUT} pl-8 w-full`} />
        </div>
        <div className="relative flex-1 min-w-[140px]">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] flex items-center">
            <User animateOnHover size={16} />
          </span>
          <input type="text" value={filters.assignedTo}
            onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}
            placeholder="Search assignee..." className={`${INPUT} pl-8 w-full`} />
        </div>
        <div className="relative flex-1 min-w-[140px]">
          <select
            value={filters.sortByDate || ""}
            onChange={(e) => setFilters((f) => ({ ...f, sortByDate: e.target.value }))}
            className={`${INPUT} w-full pr-8 cursor-pointer appearance-none bg-[var(--color-bg-elevated)]`}
          >
            <option value="">Sort by: Default</option>
            <option value="asc">Due Date: Soonest first</option>
            <option value="desc">Due Date: Latest first</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] text-[10px]">
            ▼
          </span>
        </div>
        {hasFilters && (
          <button onClick={() => setFilters({ search: "", assignedTo: "", status: "", priority: "", sortByDate: "" })}
            className={`${INPUT} px-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap flex items-center gap-1`}>
            Clear
            <X animateOnHover size={14} />
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
