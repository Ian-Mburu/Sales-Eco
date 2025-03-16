import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../slices/authSlice';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';
import '../../styles/auth/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/login/', { email, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      
      dispatch(setCredentials({ user: { email }, token: access }));
      navigate('/my-profile');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login to Your Account</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <div className="login-links">
            <a href="/forgot-password">Forgot Password?</a>
            <p>Don't have an account? <a href="/register">Sign Up</a></p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
