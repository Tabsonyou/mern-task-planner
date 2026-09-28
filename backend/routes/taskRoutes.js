const express = require("express");
const Task = require("../models/Task");

const router = express.Router();
const VALID_PRIORITIES = ["Low", "Medium", "High"];

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, priority } = req.body || {};

    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ message: "Title is required and cannot be empty" });
    }

    const chosenPriority = priority === undefined ? "Medium" : priority;

    if (!VALID_PRIORITIES.includes(chosenPriority)) {
      return res
        .status(400)
        .json({ message: "Priority must be Low, Medium or High" });
    }

    const task = await Task.create({
      title: title.trim(),
      priority: chosenPriority,
    });

    res.status(201).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: err.message });
  }
});
// GET /api/tasks (Paste this right below your existing router.post block)
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server error while fetching tasks" });
    }
});

module.exports = router;
