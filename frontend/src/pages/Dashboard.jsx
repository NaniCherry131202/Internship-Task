import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/api/projects/${projectToDelete._id}`, { headers });
      setProjects(projects.filter((project) => project._id !== projectToDelete._id));
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error('Delete project error:', err);
      toast.error('Failed to delete project');
    } finally {
      setIsModalOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Dashboard
        </h1>

        {/* Create Project Form */}
        <form onSubmit={handleCreateProject} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter project name"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
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
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            >
              <Link to={`/project/${project._id}`}>
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              </Link>
              <button
                onClick={() => handleDeleteProject(project)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={projectToDelete?.name || 'this project'}
        />
      </div>
    </div>
  );
};

export default Dashboard;