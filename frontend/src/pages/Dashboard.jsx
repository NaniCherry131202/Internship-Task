import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  // Use Vite environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_URL}/api/projects`, { headers });
        setProjects(res.data);
      } catch (err) {
        console.error('Fetch projects error:', err);
        toast.error('Failed to load projects');
      }
    };
    fetchProjects();
  }, [token]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `${API_URL}/api/projects`,
        { name: newProjectName },
        { headers }
      );
      setProjects([...projects, res.data]);
      setNewProjectName('');
      toast.success('Project created successfully!');
    } catch (err) {
      console.error('Create project error:', err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_URL}/api/projects/${id}`, { headers });
        setProjects(projects.filter((project) => project._id !== id));
        toast.success('Project deleted successfully!');
      } catch (err) {
        console.error('Delete project error:', err);
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6">
          Dashboard
        </h1>

        {/* Create Project Form */}
        <form onSubmit={handleCreateProject} className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white bg-opacity-50 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter project name"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Create Project
            </button>
          </div>
        </form>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gradient-to-r hover:from-blue-500 hover:to-purple-500"
            >
              <Link to={`/project/${project._id}`}>
                <h3 className="text-lg font-semibold text-purple-300">{project.name}</h3>
              </Link>
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="mt-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;