"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
// Create Task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description } = req.body;
        console.log("Create Task Request:", { title, description, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (!title || !description) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        if (!req.user || !req.user._id) {
            console.log("User not authenticated properly for task creation");
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const task = yield task_model_1.Task.create({
            title,
            description,
            user: req.user._id,
            status: "pending"
        });
        console.log("Task created:", {
            taskId: task._id,
            userId: task.user
        });
        res.status(201).json({ message: "Task created successfully", task });
    }
    catch (error) {
        console.error("Error in createTask controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.createTask = createTask;
// Get Tasks
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tasks = yield task_model_1.Task.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        res.status(200).json({ tasks });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.getTasks = getTasks;
// Update Task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status } = req.body;
        console.log("Update Task Request:", {
            taskId: req.params.id,
            title,
            description,
            status,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        if (!title || !description || !status) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        const task = yield task_model_1.Task.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        console.log("Task updated:", {
            taskId: task._id,
            title: task.title,
            status: task.status
        });
        res.status(200).json({ message: "Task updated successfully", task });
    }
    catch (error) {
        console.error("Error in updateTask controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.updateTask = updateTask;
// Delete Task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        console.log("Delete Task Request:", {
            taskId: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        const task = yield task_model_1.Task.findById(req.params.id);
        if (!task) {
            console.log("Task not found with ID:", req.params.id);
            res.status(404).json({ message: "Task not found" });
            return;
        }
        console.log("Task found:", {
            taskId: task._id,
            taskUser: task.user,
            requestUser: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
        });
        if (!task.user) {
            console.log("Task has no user associated with it");
            yield task_model_1.Task.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Task deleted successfully" });
            return;
        }
        // Compare user IDs
        if (task.user.toString() !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
            console.log("User not authorized. Task user:", task.user.toString(), "Request user:", (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString());
            res.status(403).json({ message: "Not authorized to delete this task" });
            return;
        }
        yield task_model_1.Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteTask controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.deleteTask = deleteTask;
