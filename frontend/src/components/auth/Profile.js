import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../slices/profileSlice';
import Header from '../Footer-Header/Header';
import Footer from '../Footer-Header/Footer';
// import { Link } from 'react-router-dom';
// import MessageButton from '../Messages/MessageButton';
// import Notification from '../Messages/Notification';
import '../../styles/auth/profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      navigate('/my-profile'); // Redirect to login if profile is not retrievable
    }
  }, [error, navigate]);

  // user messages
  const handleNavigate = () => {
    navigate('/message', { state: { user: profile } }); 
  };


  if (status === 'loading') return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  if (!profile) return (
    <div className="error-message">
      Profile not found or <a href="/login">Login</a> to view profile
    </div>
  );

  if (status === 'loading') return <div className="loading-message">Loading profile...</div>;

  return (
    <>
      <Header />
      <div className="profile-container">
        {profile && (
          <div className="profile-card">
            <div className="profile-header">
              <img src={profile.image} alt={profile.username} className="profile-img" />
              <div className="profile-info">
                <h1>{profile.full_name}</h1>
                <p>@{profile.username}</p>
                <button onClick={() => navigate('/update-profile')} className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>
            <div className="profile-details">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
              <p><strong>Location:</strong> {profile.county || 'Not specified'}</p>
              <p><strong>Joined:</strong> {new Date(profile.join_date).toLocaleDateString()}</p>
            </div>
            <div className="profile-activity">
              <h3>Activity</h3>
              <p><strong>Total Listings:</strong> {profile.total_listings || 0}</p>
              <p><strong>Total Orders:</strong> {profile.total_orders || 0}</p>
              <p><strong>Wishlist Items:</strong> {profile.wishlist_count || 0}</p>
            </div>
            <div className="profile-security">
              <h3>Security</h3>
              <p><strong>Last Login:</strong> {new Date(profile.last_login).toLocaleString()}</p>
              <button className="security-btn">Change Password</button>
            </div>
            
            <button onClick={handleNavigate}>
              My messages
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;