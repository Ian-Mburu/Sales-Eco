import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitContact } from '../../slices/ContactSlice';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';
import '../../styles/pages/contact.css';

const ContactForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { status, error } = useSelector((state) => state.contact);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContact(formData));
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-description">We would love to hear from you. Fill out the form below and we will get back to you as soon as possible.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="contact-input"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="contact-input"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="contact-input"
            required
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="contact-textarea"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="contact-submit"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {error && <p className="contact-error">{error}</p>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;