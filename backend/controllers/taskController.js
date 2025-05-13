const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  const { title, description, projectId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const task = new Task({ title, description, project: projectId });
    await task.save();
    project.tasks.push(task._id);
    await project.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task || task.project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    if (status === 'Completed' && !task.completedAt) {
      task.completedAt = new Date();
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task || task.project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};