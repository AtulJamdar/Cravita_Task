const Task = require("../models/task");

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
// Supports: search (title, assignedTo), filter (status, priority), pagination
const getAllTasks = async (req, res) => {
  try {
    const { search, assignedTo, status, priority, page = 1, limit = 50 } = req.query;

    const query = {};

    // Search by title (case-insensitive partial match)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Search by assignedTo (case-insensitive partial match)
    if (assignedTo) {
      query.assignedTo = { $regex: assignedTo, $options: "i" };
    }

    // Filter by status
    if (status) {
      const validStatuses = ["Pending", "In Progress", "Completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status filter" });
      }
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      const validPriorities = ["Low", "Medium", "High"];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ success: false, message: "Invalid priority filter" });
      }
      query.priority = priority;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── GET /api/tasks/stats ────────────────────────────────────────────────────
// Dashboard summary: total, pending, in-progress, completed counts
const getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "Pending" }),
      Task.countDocuments({ status: "In Progress" }),
      Task.countDocuments({ status: "Completed" }),
    ]);

    res.json({
      success: true,
      data: { total, pending, inProgress, completed },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── GET /api/tasks/:id ──────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── POST /api/tasks ─────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    const task = new Task({ title, description, assignedTo, priority, status, dueDate });
    await task.save();

    res.status(201).json({ success: true, message: "Task created successfully", data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── PUT /api/tasks/:id ──────────────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (assignedTo !== undefined) updatedFields.assignedTo = assignedTo;
    if (priority !== undefined) updatedFields.priority = priority;
    if (status !== undefined) updatedFields.status = status;
    if (dueDate !== undefined) updatedFields.dueDate = dueDate;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task updated successfully", data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── PATCH /api/tasks/:id/status ─────────────────────────────────────────────
// Lightweight endpoint for instant status changes from the dashboard
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Status updated", data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ─── DELETE /api/tasks/:id ───────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully", data: { id: req.params.id } });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};