const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/tasks', projectController.addTask);
router.put('/:projectId/tasks/:taskId', projectController.updateTask); // Added route for updating tasks

module.exports = router;