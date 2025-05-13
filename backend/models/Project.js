const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
});

// Cascade delete tasks when a project is deleted
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  console.log('Deleting tasks for project:', this._id);
  await this.model('Task').deleteMany({ _id: { $in: this.tasks } });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);