import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskCard = ({ task, project, setProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.put(
        `${API_URL}/api/projects/${project._id}/tasks/${task._id}`,
        updatedTask,
        { headers }
      );
      setProject({
        ...project,
        tasks: project.tasks.map((t) => (t._id === task._id ? res.data : t)),
      });
      setIsEditing(false);
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Update task error:', err);
      toast.error('Failed to update task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-500';
      case 'inprogress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <input
              type="text"
              value={updatedTask.title}
              onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              value={updatedTask.description}
              onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          <div className="mb-3">
            <select
              value={updatedTask.status}
              onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
          <p className="text-gray-300 mt-2">{task.description}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm ${getStatusColor(task.status)}`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;