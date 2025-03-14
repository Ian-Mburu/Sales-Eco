import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../slices/profileSlice';
import Header from '../Footer-Header/Header';
import Footer from '../Footer-Header/Footer';
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
      navigate('/login'); // Redirect to login if profile is not retrievable
    }
  }, [error, navigate]);

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
                <button onClick={() => navigate('/update-profile')} className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>
            <div className="profile-details">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
              <p><strong>Location:</strong> {profile.county || 'Not specified'}</p>
            </div>
            <div className="profile-activity">
              <h3 className='activity'>Activity</h3>
              <p><strong>Total Listings:</strong> {profile.total_listings || 0}</p>
              <p><strong>Total Orders:</strong> {profile.total_orders || 0}</p>
              <p><strong>Wishlist Items:</strong> {profile.wishlist_count || 0}</p>
            </div>
            <div className="profile-security">
              <h3>Security</h3>
              <p><strong>Last Login:</strong> {new Date(profile.last_login).toLocaleString()}</p>
              <button className="security-btn">Change Password</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;