import { useState } from "react";
import { StatusBadge } from "./StatusBadge";

const STATUSES = ["Pending", "In Progress", "Completed"];

export default function StatusDropdown({ task, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const pick = async (status) => {
    if (status === task.status) { setOpen(false); return; }
    setBusy(true);
    try { await onUpdate(task._id, status); }
    finally { setBusy(false); setOpen(false); }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="flex items-center gap-1 disabled:opacity-60 cursor-pointer"
        title="Click to change status"
      >
        <StatusBadge status={task.status} />
        <span className="text-[var(--color-text-muted)] text-[10px] mt-0.5">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 z-20 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-1.5 shadow-2xl min-w-[160px] animate-fade-up">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => pick(s)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${s === task.status ? "bg-[var(--color-bg-hover)]" : "hover:bg-[var(--color-bg-hover)]"}`}>
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
