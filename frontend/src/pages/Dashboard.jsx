import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import Modal from "../components/Modal";
import DeleteConfirm from "../components/DeleteConfirm";
import { Sparkles } from "../components/animate-ui/sparkles";
import { Plus } from "../components/animate-ui/plus";
import { Sun } from "../components/animate-ui/sun";
import { Moon } from "../components/animate-ui/moon";
import { Card, CardHeader, CardContent, CardFooter } from "../components/seraui/card";

let BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (BASE && BASE.endsWith("/")) {
  BASE = BASE.slice(0, -1);
}
if (BASE && !BASE.endsWith("/api")) {
  BASE = `${BASE}/api`;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", assignedTo: "", status: "", priority: "", sortByDate: "" });

  const [modal, setModal] = useState(null);       // "create" | "edit" | "delete" | null
  const [activeTask, setActiveTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [plusHovered, setPlusHovered] = useState(false);
  const itemsPerPage = 5;

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ── Fetch tasks ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search)     params.search     = filters.search;
        if (filters.assignedTo) params.assignedTo = filters.assignedTo;
        if (filters.status)     params.status     = filters.status;
        if (filters.priority)   params.priority   = filters.priority;

        const res = await axios.get(`${BASE}/tasks`, { params });
        setTasks(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters]);

  // Reset pagination on filter or tasks length change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, tasks.length]);

  // ── Fetch stats ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE}/tasks/stats`);
        setStats(res.data.data);
      } catch {
        // stats failure is non-critical
      }
    };

    fetchStats();
  }, [tasks]); // re-run whenever tasks change

  // ── CRUD handlers ────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    setFormLoading(true);
    try {
      const res = await axios.post(`${BASE}/tasks`, payload);
      setTasks((prev) => [res.data.data, ...prev]);
      toast.success("Task created!");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      throw err.response?.data; // let TaskForm handle field errors
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (payload) => {
    setFormLoading(true);
    try {
      const res = await axios.put(`${BASE}/tasks/${activeTask._id}`, payload);
      setTasks((prev) => prev.map((t) => (t._id === activeTask._id ? res.data.data : t)));
      toast.success("Task updated!");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
      throw err.response?.data;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE}/tasks/${activeTask._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== activeTask._id));
      toast.success("Task deleted");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await axios.patch(`${BASE}/tasks/${id}/status`, { status });
      toast.success("Status updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      // Revert: re-fetch
      const res = await axios.get(`${BASE}/tasks`);
      setTasks(res.data.data);
    }
  };

  const handleToggleSort = () => {
    setFilters((f) => {
      let nextSort = "";
      if (f.sortByDate === "") nextSort = "asc";
      else if (f.sortByDate === "asc") nextSort = "desc";
      return { ...f, sortByDate: nextSort };
    });
  };

  // ── Modal helpers ────────────────────────────────────────────────────────
  const openCreate = () => { setActiveTask(null); setModal("create"); };
  const openEdit   = (t)  => { setActiveTask(t);  setModal("edit");   };
  const openDelete = (t)  => { setActiveTask(t);  setModal("delete"); };
  const closeModal = ()   => { setModal(null); setActiveTask(null);    };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            color: "#1e293b",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "12px",
            padding: "10px 16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-[var(--color-border)]/40 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <Sparkles animateOnHover size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">TaskBoard</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={openCreate}
            onMouseEnter={() => setPlusHovered(true)}
            onMouseLeave={() => setPlusHovered(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
          >
            <Plus animate={plusHovered ? "default" : false} size={16} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-6 py-7">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage and track all your tasks</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard type="total"      value={stats.total}      />
          <StatCard type="pending"    value={stats.pending}    />
          <StatCard type="inProgress" value={stats.inProgress} />
          <StatCard type="completed"  value={stats.completed}  />
        </div>

        {/* Task panel */}
        {(() => {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const sortedTasks = [...tasks].sort((a, b) => {
            if (!filters.sortByDate) return 0;
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return filters.sortByDate === "asc" ? dateA - dateB : dateB - dateA;
          });
          const paginatedTasks = sortedTasks.slice(startIndex, startIndex + itemsPerPage);
          const totalPages = Math.max(1, Math.ceil(tasks.length / itemsPerPage));

          return (
            <Card className="relative overflow-hidden border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-surface)] gap-0 py-0 shadow-sm">
              {/* Panel toolbar */}
              <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 py-4 border-b border-[var(--color-border)] flex-wrap grid-rows-none grid-cols-none">
                <div className="flex-1 min-w-0">
                  <FilterBar filters={filters} setFilters={setFilters} />
                </div>
                <div className="pt-1 shrink-0">
                  <span className="text-xs text-[var(--color-text-muted)]">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
                </div>
              </CardHeader>

              {/* Table */}
              <CardContent className="p-0">
                <TaskTable
                  tasks={paginatedTasks}
                  loading={loading}
                  filters={filters}
                  darkMode={darkMode}
                  onToggleSort={handleToggleSort}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onStatusUpdate={handleStatusUpdate}
                />
              </CardContent>

              {/* Pagination controls in CardFooter */}
              {!loading && tasks.length > 0 && (
                <CardFooter className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-border)] select-none">
                  <div className="text-xs text-[var(--color-text-muted)]">
                    Showing <span className="font-semibold text-[var(--color-text-primary)]">{startIndex + 1}</span> to{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {Math.min(startIndex + itemsPerPage, tasks.length)}
                    </span>{" "}
                    of <span className="font-semibold text-[var(--color-text-primary)]">{tasks.length}</span> tasks
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => {
                        const page = idx + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </CardFooter>
              )}
            </Card>
          );
        })()}
      </main>

      {/* ── Modals ── */}
      {modal === "create" && (
        <Modal title="New Task" onClose={closeModal}>
          <TaskForm onSubmit={handleCreate} onCancel={closeModal} loading={formLoading} />
        </Modal>
      )}
      {modal === "edit" && activeTask && (
        <Modal title="Edit Task" onClose={closeModal}>
          <TaskForm initial={activeTask} onSubmit={handleUpdate} onCancel={closeModal} loading={formLoading} />
        </Modal>
      )}
      {modal === "delete" && activeTask && (
        <DeleteConfirm task={activeTask} onConfirm={handleDelete} onCancel={closeModal} />
      )}
    </div>
  );
}
