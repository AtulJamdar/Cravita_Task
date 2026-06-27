import { useState } from "react";
import Modal from "./Modal";
import { Trash } from "./animate-ui/trash";

export default function DeleteConfirm({ task, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => { setLoading(true); try { await onConfirm(); } finally { setLoading(false); } };

  return (
    <Modal title="Delete Task" onClose={onCancel} maxWidth="max-w-sm">
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-400">
          <Trash animateOnHover size={28} />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">Permanently delete</p>
        <p className="font-bold text-[var(--color-text-primary)] mb-1">"{task.title}"</p>
        <p className="text-xs text-[var(--color-text-muted)] mb-6">This cannot be undone.</p>
        <div className="flex gap-2 justify-center">
          <button onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Keep it
          </button>
          <button onClick={handle} disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-70">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />}
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
