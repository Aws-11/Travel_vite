import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const initialUser = { password: '', identifier: '' };

const Login = () => {
  const [user, setUser] = useState(initialUser);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleSignUpBtn = () => {
    navigate('/registration');
  };

  const handleLogin = async () => {
    const url = `https://travel-vite-backend.onrender.com/login`;
    try {
      if (user.identifier && user.password) {
        const response = await axios.post(url, user); // Removed { withCredentials: true }

        if (response.data && response.data.user && response.data.token) {
          toast.success('Login successful!');
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
          sessionStorage.setItem("token", response.data.token);

          if (response.data.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }

          setUser(initialUser);
          setErrorMessage('');
          window.location.reload();
        } else {
          setErrorMessage('Invalid login credentials!');
        }
      } else {
        setErrorMessage('Please fill in all fields.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Invalid login credentials!');
      } else if (error.request) {
        setErrorMessage('No response from server. Please try again!');
      } else {
        setErrorMessage('Login error. Please try again!');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-neutral-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="text" // Use text instead of email to accept username or email
                name="identifier"
                value={user.identifier}
                onChange={handleChange}
                placeholder="Enter your username or email"
                autoComplete="username" // or "email"
                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Login
            </button>

            <div className="flex items-center justify-center space-x-2 text-gray-400 mt-4">
              <div className="h-px w-1/4 bg-gray-600"></div>
              <span>Or</span>
              <div className="h-px w-1/4 bg-gray-600"></div>
            </div>

            <button
              onClick={handleSignUpBtn}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-800 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-900 transition-colors"
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;