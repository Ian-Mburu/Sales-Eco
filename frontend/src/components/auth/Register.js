import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import '../../styles/auth/register.css';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await API.post('/auth/register/', {
        full_name: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword 
      });
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <>
    <Header />
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <p>Already have an account? <a className='login-link' href="/login">Login</a></p>
        <button type="submit">Register</button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default Register;
