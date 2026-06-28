import { format } from "date-fns";
import { PriorityBadge } from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";
import { Pencil } from "./animate-ui/pencil";
import { Trash } from "./animate-ui/trash";
import { MarkdownTable, TableHead, TableBody, TableRow, TableHeader, TableCell } from "./seraui/table";

export default function TaskTable({ tasks, loading, filters, darkMode, onToggleSort, onEdit, onDelete, onStatusUpdate }) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] border-t-blue-500 animate-spin-fast" />
      <span className="text-sm text-[var(--color-text-muted)]">Loading tasks...</span>
    </div>
  );

  const textColor = darkMode ? "text-white" : "text-black";
  const mutedTextColor = darkMode ? "text-white/70" : "text-black/70";
  const buttonColor = darkMode ? "text-white/75" : "text-black/75";

  if (!tasks.length) return (
    <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
      <div className="text-4xl mb-2">📋</div>
      <p className={`text-sm font-semibold ${textColor}`}>No tasks found</p>
      <p className={`text-xs ${mutedTextColor}`}>Adjust your search or filters, or create a new task.</p>
    </div>
  );

  return (
    <>
      {/* Mobile view: list of cards */}
      <div className="md:hidden divide-y divide-[var(--color-border)]/50">
        {tasks.map((task) => {
          const due = new Date(task.dueDate);
          const overdue = due < new Date() && task.status !== "Completed";
          return (
            <div key={task._id} className="p-4 space-y-3 bg-[var(--color-bg-surface)]">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className={`font-semibold ${textColor} text-sm truncate`}>{task.title}</p>
                  {task.description && (
                    <p className={`text-xs ${mutedTextColor} mt-1 max-w-[260px] truncate`}>{task.description}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
                    {task.assignedTo.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-xs ${textColor}`}>{task.assignedTo}</span>
                </div>
                
                <div className="text-right">
                  <span className={`text-xs ${overdue ? "text-red-400 font-semibold" : textColor}`}>
                    {format(due, "dd MMM yyyy")}
                  </span>
                  {overdue && <p className="text-[9px] text-red-400 font-medium">Overdue</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/20">
                <StatusDropdown task={task} onUpdate={onStatusUpdate} />
                
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onEdit(task)}
                    className={`w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] ${buttonColor} hover:text-blue-400 hover:border-blue-500/50 flex items-center justify-center transition-colors`}
                    title="Edit task">
                    <Pencil animateOnHover size={13} />
                  </button>
                  <button onClick={() => onDelete(task)}
                    className={`w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] ${buttonColor} hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-colors`}
                    title="Delete task">
                    <Trash animateOnHover size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block overflow-x-auto">
        <MarkdownTable variant="minimal" className="my-0">
          <TableHead variant="minimal">
            <TableRow variant="minimal" className="border-b border-[var(--color-border)]">
              <TableHeader variant="minimal" className={`px-4 py-3 text-left text-[10px] font-bold ${textColor} uppercase tracking-widest whitespace-nowrap`}>Title</TableHeader>
              <TableHeader variant="minimal" className={`px-4 py-3 text-left text-[10px] font-bold ${textColor} uppercase tracking-widest whitespace-nowrap`}>Assigned To</TableHeader>
              <TableHeader variant="minimal" className={`px-4 py-3 text-left text-[10px] font-bold ${textColor} uppercase tracking-widest whitespace-nowrap`}>Priority</TableHeader>
              <TableHeader variant="minimal" className={`px-4 py-3 text-left text-[10px] font-bold ${textColor} uppercase tracking-widest whitespace-nowrap`}>Status</TableHeader>
              <TableHeader 
                variant="minimal" 
                onClick={onToggleSort}
                className={`px-4 py-3 text-left text-[10px] font-bold ${textColor} uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-[var(--color-bg-hover)] select-none`}
              >
                Due Date {filters?.sortByDate === "asc" ? " ▲" : filters?.sortByDate === "desc" ? " ▼" : ""}
              </TableHeader>
              <TableHeader variant="minimal" className={`px-4 py-3 text-right text-[10px] font-bold ${textColor} uppercase tracking-widest whitespace-nowrap`}>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody variant="minimal">
            {tasks.map((task) => {
              const due = new Date(task.dueDate);
              const overdue = due < new Date() && task.status !== "Completed";
              return (
                <TableRow key={task._id} variant="minimal"
                  className="group hover:bg-[var(--color-bg-hover)] border-b border-[var(--color-border)] last:border-0 transition-colors"
                >
                  <TableCell variant="minimal" className="px-4 py-3.5 align-middle">
                    <p className={`font-semibold ${textColor} text-sm`}>{task.title}</p>
                    {task.description && (
                      <p className={`text-xs ${mutedTextColor} mt-0.5 max-w-[260px] truncate`}>{task.description}</p>
                    )}
                  </TableCell>
                  <TableCell variant="minimal" className="px-4 py-3.5 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                        {task.assignedTo.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-sm ${textColor}`}>{task.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell variant="minimal" className="px-4 py-3.5 align-middle"><PriorityBadge priority={task.priority} /></TableCell>
                  <TableCell variant="minimal" className="px-4 py-3.5 align-middle">
                    <StatusDropdown task={task} onUpdate={onStatusUpdate} />
                  </TableCell>
                  <TableCell variant="minimal" className="px-4 py-3.5 align-middle">
                    <span className={`text-sm ${overdue ? "text-red-400 font-semibold" : textColor}`}>
                      {format(due, "dd MMM yyyy")}
                    </span>
                    {overdue && <p className="text-[10px] text-red-400 mt-0.5 font-medium">Overdue</p>}
                  </TableCell>
                  <TableCell variant="minimal" className="px-4 py-3.5 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => onEdit(task)}
                        className={`w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] ${buttonColor} hover:text-blue-400 hover:border-blue-500/50 flex items-center justify-center transition-colors`}
                        title="Edit task">
                        <Pencil animateOnHover size={14} />
                      </button>
                      <button onClick={() => onDelete(task)}
                        className={`w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] ${buttonColor} hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-colors`}
                        title="Delete task">
                        <Trash animateOnHover size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </MarkdownTable>
      </div>
    </>
  );
}
