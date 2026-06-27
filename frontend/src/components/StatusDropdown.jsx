import { useState } from "react";
import { createPortal } from "react-dom";
import { StatusBadge } from "./StatusBadge";
import { ChevronDown } from "./animate-ui/chevron-down";

const STATUSES = ["Pending", "In Progress", "Completed"];

export default function StatusDropdown({ task, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setOpen((o) => !o);
  };

  const pick = async (status) => {
    if (status === task.status) { setOpen(false); return; }
    setBusy(true);
    try { await onUpdate(task._id, status); }
    finally { setBusy(false); setOpen(false); }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={busy}
        className="flex items-center gap-1 disabled:opacity-60 cursor-pointer"
        title="Click to change status"
      >
        <StatusBadge status={task.status} />
        <ChevronDown animateOnHover size={12} className="text-[var(--color-text-muted)]" />
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              position: "absolute",
            }}
            className="z-50 mt-1.5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-1.5 shadow-2xl min-w-[160px] animate-fade-up"
          >
            {STATUSES.map((s) => (
              <button key={s} onClick={() => pick(s)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${s === task.status ? "bg-[var(--color-bg-hover)]" : "hover:bg-[var(--color-bg-hover)]"}`}>
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
