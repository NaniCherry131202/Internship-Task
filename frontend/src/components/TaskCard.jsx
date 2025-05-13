import React, { useState } from 'react';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';
import { toast } from 'react-toastify';

const TaskCard = ({ task, projectId, setProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/tasks/${task._id}`,
        editedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t._id === task._id ? res.data : t)),
      }));
      setIsEditing(false);
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Update task error:', err);
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/projects/${projectId}/tasks/${task._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t._id !== task._id),
      }));
      setIsModalOpen(false);
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Delete task error:', err);
      toast.error('Failed to delete task');
    }
  };

  return (
    <>
      <div className="task-card border-2 border-transparent hover:border-gradient-to-r hover:from-blue-400 hover:to-purple-400 transform transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200 hover:scale-105">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
            />
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
            />
            <select
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full hover:from-green-400 hover:to-teal-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full hover:from-gray-400 hover:to-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-purple-700">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <span
              className={`status-${task.status} mt-2 inline-block transition-all duration-300 hover:scale-105`}
            >
              {task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : 'Completed'}
            </span>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Edit
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-red-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TaskCard;