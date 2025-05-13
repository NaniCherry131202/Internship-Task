import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        const res = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Fetch projects error:', err.message);
        toast.error(err.message || 'Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const trimmedName = newProjectName.trim();
    if (!trimmedName) {
      toast.error('Project name cannot be empty');
      return;
    }

    if (projects.length >= 4) {
      toast.error('You can only create up to 4 projects');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      console.log('Creating project with name:', trimmedName);
      const res = await axios.post(
        'http://localhost:5000/api/projects',
        { name: trimmedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      setNewProjectName('');
      toast.success('Project created successfully!');
    } catch (err) {
      console.error('Create project error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create project';
      toast.error(errorMessage);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${projectToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project._id !== projectToDelete._id));
      setIsModalOpen(false);
      setProjectToDelete(null);
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error('Delete project error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete project';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Dashboard
      </h1>
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleCreateProject} className="flex space-x-4">
          <input
            type="text"
            placeholder="New Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Create New Project
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200 hover:scale-105 flex justify-between items-center"
          >
            <Link to={`/project/${project._id}`} className="flex-1">
              <h2 className="text-xl font-semibold text-purple-700">{project.name}</h2>
            </Link>
            <button
              onClick={() => {
                setProjectToDelete(project);
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-red-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <DeleteConfirmModal
          onConfirm={handleDeleteProject}
          onCancel={() => {
            setIsModalOpen(false);
            setProjectToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;