import { useState, useEffect } from "react";
import { format } from "date-fns";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const FIELD_CLASS = "w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] px-3 py-2.5 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors";
const FIELD_ERROR = "border-red-500/60 focus:border-red-500";
const LABEL_CLASS = "block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5";

export default function TaskForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: "", description: "", assignedTo: "",
    priority: "Medium", status: "Pending", dueDate: "",
    ...initial,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial?.dueDate) {
      setForm((f) => ({ ...f, dueDate: format(new Date(initial.dueDate), "yyyy-MM-dd") }));
    }
  }, [initial?.dueDate]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim())     e.title     = "Title is required";
    if (!form.assignedTo.trim())e.assignedTo= "Assigned To is required";
    if (!form.priority)         e.priority  = "Priority is required";
    if (!form.status)           e.status    = "Status is required";
    if (!form.dueDate) {
      e.dueDate = "Due date is required";
    } else {
      const today = new Date(); today.setHours(0,0,0,0);
      if (new Date(form.dueDate) < today) e.dueDate = "Due date cannot be in the past";
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await onSubmit({ ...form, dueDate: new Date(form.dueDate).toISOString() });
    } catch (apiErr) {
      if (apiErr.errors?.length) {
        const mapped = {};
        apiErr.errors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
      }
    }
  };

  const F = ({ name, label, required, children }) => (
    <div>
      <label className={LABEL_CLASS}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
      {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name]}</p>}
    </div>
  );

  const cls = (name) => `${FIELD_CLASS} ${errors[name] ? FIELD_ERROR : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <F name="title" label="Task Title" required>
        <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Design homepage wireframe" className={cls("title")} />
      </F>

      <F name="description" label="Description">
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
          placeholder="Optional details..." rows={3}
          className={`${FIELD_CLASS} resize-none`} />
      </F>

      <F name="assignedTo" label="Assigned To" required>
        <input type="text" value={form.assignedTo} onChange={(e) => set("assignedTo", e.target.value)}
          placeholder="e.g. John" className={cls("assignedTo")} />
      </F>

      <div className="grid grid-cols-2 gap-3">
        <F name="priority" label="Priority" required>
          <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={cls("priority")}>
            <option value="">Select...</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </F>
        <F name="status" label="Status" required>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={cls("status")}>
            <option value="">Select...</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </F>
      </div>

      <F name="dueDate" label="Due Date" required>
        <input type="date" value={form.dueDate} min={todayStr()}
          onChange={(e) => set("dueDate", e.target.value)} className={cls("dueDate")} />
      </F>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} disabled={loading}
          className="px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:text-[var(--color-text-primary)] transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-70">
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />}
          {initial ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
