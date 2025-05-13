const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
  const { name } = req.body;
  console.log('Create project request:', { name, userId: req.user.id });

  try {
    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.log('Validation failed: Project name is required');
      return res.status(400).json({ message: 'Project name is required and must be a non-empty string' });
    }

    // Check user's project limit
    const user = await User.findById(req.user.id).populate('projects');
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.projects.length >= 4) {
      console.log('Project limit reached for user:', req.user.id);
      return res.status(400).json({ message: 'You can only create up to 4 projects' });
    }

    // Create project
    const project = new Project({
      name: name.trim(),
      user: req.user.id,
    });

    await project.save();

    // Add project to user's projects
    user.projects.push(project._id);
    await user.save();

    console.log('Project created successfully:', project._id);
    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    console.log('Fetching projects for user:', req.user.id);
    const projects = await Project.find({ user: req.user.id }).populate('tasks');
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    console.log('Fetching project:', req.params.id);
    const project = await Project.findById(req.params.id).populate('tasks');
    if (!project) {
      console.log('Project not found:', req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      console.log('Unauthorized access to project:', req.params.id);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(project);
  } catch (err) {
    console.error('Get project error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    console.log('Deleting project:', req.params.id);
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found:', req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      console.log('Unauthorized access to project:', req.params.id);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Remove project from user's projects
    const user = await User.findById(req.user.id);
    user.projects = user.projects.filter(
      (projId) => projId.toString() !== project._id.toString()
    );
    await user.save();

    // Delete the project (this will also delete associated tasks due to cascade in model)
    await project.deleteOne();

    console.log('Project deleted successfully:', project._id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.addTask = async (req, res) => {
  const { title, description, status } = req.body;
  console.log('Adding task to project:', req.params.id, { title, description, status });

  try {
    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      console.log('Validation failed: Task title is required');
      return res.status(400).json({ message: 'Task title is required and must be a non-empty string' });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      console.log('Validation failed: Task description is required');
      return res.status(400).json({ message: 'Task description is required and must be a non-empty string' });
    }
    if (!['todo', 'inprogress', 'completed'].includes(status)) {
      console.log('Validation failed: Invalid status');
      return res.status(400).json({ message: 'Status must be one of: todo, inprogress, completed' });
    }

    // Find the project
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found:', req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      console.log('Unauthorized access to project:', req.params.id);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create the task
    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      status,
      project: project._id,
    });

    await task.save();

    // Add task to project
    project.tasks.push(task._id);
    await project.save();

    console.log('Task created successfully:', task._id);
    res.status(201).json(task);
  } catch (err) {
    console.error('Add task error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  console.log('Updating task:', req.params.taskId, { title, description, status });

  try {
    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      console.log('Validation failed: Task title is required');
      return res.status(400).json({ message: 'Task title is required and must be a non-empty string' });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      console.log('Validation failed: Task description is required');
      return res.status(400).json({ message: 'Task description is required and must be a non-empty string' });
    }
    if (!['todo', 'inprogress', 'completed'].includes(status)) {
      console.log('Validation failed: Invalid status');
      return res.status(400).json({ message: 'Status must be one of: todo, inprogress, completed' });
    }

    // Find the project
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      console.log('Project not found:', req.params.projectId);
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      console.log('Unauthorized access to project:', req.params.projectId);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find the task
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      console.log('Task not found:', req.params.taskId);
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.project.toString() !== project._id.toString()) {
      console.log('Task does not belong to project:', req.params.taskId);
      return res.status(403).json({ message: 'Task does not belong to this project' });
    }

    // Update the task
    task.title = title.trim();
    task.description = description.trim();
    task.status = status;
    await task.save();

    console.log('Task updated successfully:', task._id);
    res.json(task);
  } catch (err) {
    console.error('Update task error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};