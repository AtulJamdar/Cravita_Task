import { format } from "date-fns";
import { PriorityBadge } from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";

const TH = "px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)] whitespace-nowrap";
const TD = "px-4 py-3.5 border-b border-[var(--color-border)] align-middle";

export default function TaskTable({ tasks, loading, onEdit, onDelete, onStatusUpdate }) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] border-t-blue-500 animate-spin-fast" />
      <span className="text-sm text-[var(--color-text-muted)]">Loading tasks...</span>
    </div>
  );

  if (!tasks.length) return (
    <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
      <div className="text-4xl mb-2">📋</div>
      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">No tasks found</p>
      <p className="text-xs text-[var(--color-text-muted)]">Adjust your search or filters, or create a new task.</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={TH}>Title</th>
            <th className={TH}>Assigned To</th>
            <th className={TH}>Priority</th>
            <th className={TH}>Status</th>
            <th className={TH}>Due Date</th>
            <th className={`${TH} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => {
            const due = new Date(task.dueDate);
            const overdue = due < new Date() && task.status !== "Completed";
            return (
              <tr key={task._id}
                className="group hover:bg-[var(--color-bg-hover)] transition-colors"
                style={{ animation: `fadeUp 0.2s ease ${i * 0.03}s both` }}
              >
                <td className={TD}>
                  <p className="font-semibold text-[var(--color-text-primary)] text-sm">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 max-w-[260px] truncate">{task.description}</p>
                  )}
                </td>
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                      {task.assignedTo.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-[var(--color-text-secondary)]">{task.assignedTo}</span>
                  </div>
                </td>
                <td className={TD}><PriorityBadge priority={task.priority} /></td>
                <td className={TD}>
                  <StatusDropdown task={task} onUpdate={onStatusUpdate} />
                </td>
                <td className={TD}>
                  <span className={`text-sm ${overdue ? "text-red-400 font-semibold" : "text-[var(--color-text-secondary)]"}`}>
                    {format(due, "dd MMM yyyy")}
                  </span>
                  {overdue && <p className="text-[10px] text-red-400 mt-0.5 font-medium">Overdue</p>}
                </td>
                <td className={`${TD} text-right`}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => onEdit(task)}
                      className="w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-blue-400 hover:border-blue-500/50 flex items-center justify-center text-sm transition-colors"
                      title="Edit task">
                      ✎
                    </button>
                    <button onClick={() => onDelete(task)}
                      className="w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-red-400 hover:border-red-500/50 flex items-center justify-center text-sm transition-colors"
                      title="Delete task">
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
