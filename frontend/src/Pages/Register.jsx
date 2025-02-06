import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const initialUser = { email: '', username: '', password: '', confirmPassword: '' };

const Register = () => {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    if (user.password !== user.confirmPassword) {
      console.error("Passwords do not match!");
      return;
    }

    const url = `https://travel-vite-backend.onrender.com/register`;
    try {
      const { data } = await axios.post(url, {
        email: user.email,
        username: user.username,
        password: user.password,
      });
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error.message);
      toast.error('Registration failed. Please try again!');
    }
  };

  return (
    <>
      <Navbar />
      <div className='bg-neutral-900 min-h-screen text-white'>
        <div className='container mx-auto p-6'>
          <div className='bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto'>
            <h1 className='text-4xl font-bold text-center text-white mb-6'>Register</h1>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-white mb-2'>Email</label>
                <input
                  className='block w-full px-4 py-2 bg-neutral-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500'
                  type='email'
                  name='email'
                  value={user.email}
                  onChange={handleChange}
                  placeholder='Enter your email'
                  autoComplete='email'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-white mb-2'>Username</label>
                <input
                  className='block w-full px-4 py-2 bg-neutral-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500'
                  type='text'
                  name='username'
                  value={user.username}
                  onChange={handleChange}
                  placeholder='Enter your username'
                  autoComplete='username'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-white mb-2'>Password</label>
                <input
                  className='block w-full px-4 py-2 bg-neutral-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500'
                  type='password'
                  name='password'
                  value={user.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  autoComplete='new-password'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-white mb-2'>Confirm Password</label>
                <input
                  className='block w-full px-4 py-2 bg-neutral-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500'
                  type='password'
                  name='confirmPassword'
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm your password'
                  autoComplete='new-password'
                />
              </div>

              <button
                className='w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300'
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
