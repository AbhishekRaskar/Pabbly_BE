const express = require("express");
const { auth } = require("../Middleware/authMiddleware");
const { taskModel } = require("../Models/taskModel");

const taskRouter = express.Router();
taskRouter.use(auth);

// To Add a new task
taskRouter.post("/add", async (req, res) => {
    try {
        // Associate the task with the user creating it
        const task = new taskModel({
            ...req.body,
            createdBy: req.user.userID, // Assuming req.user contains the user information from the auth middleware
        });
        await task.save();
        res.json({ msg: "New Task has been added", task: req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// To Get all tasks of the logged-in user with pagination
taskRouter.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const tasksPerPage = 5;
        const skip = (page - 1) * tasksPerPage;

        // Only retrieve tasks created by the logged-in user
        const tasks = await taskModel
            .find({ createdBy: req.user.userID })
            .skip(skip)
            .limit(tasksPerPage);

        res.json({ msg: "List of Tasks", tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// To Update a task
taskRouter.patch("/update/:taskID", async (req, res) => {
    const { taskID } = req.params;

    try {
        // Ensure the task belongs to the logged-in user before updating
        const task = await taskModel.findOneAndUpdate(
            { _id: taskID, createdBy: req.user.userID },
            req.body,
            { new: true } // Return the updated document
        );

        if (task) {
            res.json({ msg: `${task.title} has been updated`, task });
        } else {
            res.status(404).json({ msg: "Task not found or unauthorized" });
        }
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: error.message });
    }
});

// To Delete a task
taskRouter.delete("/delete/:taskID", async (req, res) => {
    const { taskID } = req.params;

    try {
        // Ensure the task belongs to the logged-in user before deleting
        const task = await taskModel.findOneAndDelete({ _id: taskID, createdBy: req.user.userID });

        if (task) {
            res.json({ msg: `${task.title} has been deleted`, task });
        } else {
            res.status(404).json({ msg: "Task not found or unauthorized" });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = {
    taskRouter
};
