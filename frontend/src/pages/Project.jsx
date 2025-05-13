import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import { toast } from 'react-toastify';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        console.error('Fetch project error:', err);
        toast.error('Failed to fetch project');
      }
    };
    fetchProject();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/projects/${id}/tasks`,
        newTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject({ ...project, tasks: [...project.tasks, res.data] });
      setNewTask({ title: '', description: '', status: 'todo' });
      toast.success('Task added successfully!');
    } catch (err) {
      console.error('Add task error:', err);
      toast.error('Failed to add task');
    }
  };

  if (!project) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {project.name}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-full hover:from-gray-400 hover:to-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
        <form onSubmit={handleAddTask} className="mb-8 bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
              required
            />
            <input
              type="text"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
              required
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Add Task
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              projectId={id}
              setProject={setProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;