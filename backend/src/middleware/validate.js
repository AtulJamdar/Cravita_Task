const { body, validationResult } = require("express-validator");


const taskValidationRules = (isUpdate = false) => {
  const rules = [];

  const titleRule = body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required");

  const assignedToRule = body("assignedTo")
    .trim()
    .notEmpty()
    .withMessage("Assigned To is required");

  const priorityRule = body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High");

  const statusRule = body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress, or Completed");

  const dueDateRule = body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(value);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    });

  if (isUpdate) {
    // For updates, make fields optional but still validate if provided
    rules.push(
      body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
      body("assignedTo").optional().trim().notEmpty().withMessage("Assigned To cannot be empty"),
      body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),
      body("status").optional().isIn(["Pending", "In Progress", "Completed"]).withMessage("Status must be Pending, In Progress, or Completed"),
      body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date")
        .custom((value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const inputDate = new Date(value);
          inputDate.setHours(0, 0, 0, 0);
          if (inputDate < today) {
            throw new Error("Due date cannot be in the past");
          }
          return true;
        })
    );
  } else {
    rules.push(titleRule, assignedToRule, priorityRule, statusRule, dueDateRule);
  }

  return rules;
};

// Status-only validation for quick status updates
const statusValidationRules = () => [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress, or Completed"),
];

// Middleware to catch validation errors and return a clean response
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { taskValidationRules, statusValidationRules, validate };