import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold transition-all duration-300 hover:scale-105">
          Task Tracker
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg transition-all duration-300 hover:scale-105">
              Hello, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-full hover:from-red-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;