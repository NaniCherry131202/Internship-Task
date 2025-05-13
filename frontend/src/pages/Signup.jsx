import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signup = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
        name,
        country,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success('Signed up successfully!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Signup
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-purple-700 mb-2 text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-purple-700 mb-2 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-purple-700 mb-2 text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-purple-700 mb-2 text-sm font-medium" htmlFor="country">
              Country
            </label>
            <input
              type="text"
              id="country"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all duration-300 hover:border-purple-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;