import { useState, useEffect } from "react";
import { format } from "date-fns";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const FIELD_CLASS =
  "w-full px-3.5 py-2.5 rounded-sm bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-zinc-600 transition-colors";

const FIELD_ERROR = "border-red-500 focus:border-red-500";

const LABEL_CLASS = "text-white text-sm";

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-2.5">
    <label className={LABEL_CLASS}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    {children}

    {error && (
      <p className="text-xs text-red-400 mt-0.5">
        {error}
      </p>
    )}
  </div>
);

export default function TaskForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    ...initial,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial?.dueDate) {
      setForm((f) => ({
        ...f,
        dueDate: format(new Date(initial.dueDate), "yyyy-MM-dd"),
      }));
    }
  }, [initial?.dueDate]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = "Title is required";
    if (!form.assignedTo.trim())
      e.assignedTo = "Assigned To is required";
    if (!form.priority) e.priority = "Priority is required";
    if (!form.status) e.status = "Status is required";

    if (!form.dueDate) {
      e.dueDate = "Due date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (new Date(form.dueDate) < today) {
        e.dueDate = "Due date cannot be in the past";
      }
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      await onSubmit({
        ...form,
        dueDate: new Date(form.dueDate).toISOString(),
      });
    } catch (apiErr) {
      if (apiErr.errors?.length) {
        const mapped = {};

        apiErr.errors.forEach(({ field, message }) => {
          mapped[field] = message;
        });

        setErrors(mapped);
      }
    }
  };



  const cls = (name) =>
    `${FIELD_CLASS} ${errors[name] ? FIELD_ERROR : ""}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <Field label="Task Title" required error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Design homepage wireframe"
          className={cls("title")}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Optional details..."
          className={`${FIELD_CLASS} resize-none py-3`}
        />
      </Field>

      <Field label="Assigned To" required error={errors.assignedTo}>
        <input
          type="text"
          value={form.assignedTo}
          onChange={(e) => set("assignedTo", e.target.value)}
          placeholder="e.g. John Doe"
          className={cls("assignedTo")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Priority" required error={errors.priority}>
          <select
            value={form.priority}
            onChange={(e) => set("priority", e.target.value)}
            className={cls("priority")}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </Field>

        <Field label="Status" required error={errors.status}>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={cls("status")}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </Field>
      </div>

      <Field label="Due Date" required error={errors.dueDate}>
        <input
          type="date"
          min={todayStr()}
          value={form.dueDate}
          onChange={(e) => set("dueDate", e.target.value)}
          className={cls("dueDate")}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-3 rounded-sm bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-sm bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}

          {initial ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}