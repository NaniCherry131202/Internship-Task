import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_URL}/api/projects/${id}`, { headers });
        setProject(res.data);
      } catch (err) {
        console.error('Fetch project error:', err);
        toast.error('Failed to load project');
        navigate('/');
      }
    };
    fetchProject();
  }, [id, navigate, token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `${API_URL}/api/projects/${id}/tasks`,
        { title, description, status },
        { headers }
      );
      setProject({ ...project, tasks: [...project.tasks, res.data] });
      setTitle('');
      setDescription('');
      setStatus('todo');
      toast.success('Task added successfully!');
    } catch (err) {
      console.error('Add task error:', err);
      toast.error('Failed to add task');
    }
  };

  if (!project) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {project.name}
        </h1>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="title">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.tasks.map((task) => (
            <TaskCard key={task._id} task={task} project={project} setProject={setProject} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;