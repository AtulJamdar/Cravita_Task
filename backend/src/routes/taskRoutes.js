const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const { taskValidationRules, statusValidationRules, validate } = require("../middleware/validate");

// Stats — must be before /:id so "stats" isn't treated as an ID
router.get("/stats", getStats);

// CRUD
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", taskValidationRules(false), validate, createTask);
router.put("/:id", taskValidationRules(true), validate, updateTask);
router.delete("/:id", deleteTask);

// Instant status update (separate lightweight endpoint)
router.patch("/:id/status", statusValidationRules(), validate, updateTaskStatus);

module.exports = router;