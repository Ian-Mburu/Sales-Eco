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
  const { profile, status, error, lastUpdated } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch, lastUpdated]);

  useEffect(() => {
    if (error) {
      navigate('/my-profile'); 
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
            <img 
  src={`${profile.image}?last_update=${profile.updated_at}`}
  alt={profile.username}
  className="profile-img"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/default-avatar.png';
  }}
/>
              <div className="profile-info">
                <h1>{profile.full_name}</h1>
                <p>@{profile.username}</p>
                <button onClick={() => navigate('/update-profile')} className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>
            {/* // Update profile-details section in Profile.js */}
            <div className="profile-details">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
              <p><strong>Location:</strong> {profile.county || 'Not specified'}</p>
              <p><strong>Joined:</strong> {new Date(profile.join_date).toLocaleDateString()}</p>
              <div className="social-links">
                  {profile.facebook && (
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
                )}
                {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                )}
                </div>
              </div>
            <div className="profile-activity">
              <h3>Activity</h3>
              <p><strong>Total Listings:</strong> {profile.total_listings || 0}</p>
              <p><strong>Total Orders:</strong> {profile.total_orders || 0}</p>
              <p><strong>Wishlist Items:</strong> {profile.wishlist_count || 0}</p>
            </div>

            <div className="seller-rating">
              <h3>Seller Rating</h3>
              <div className="rating-stars">
                {[1,2,3,4,5].map((star) => (
                <i key={star} className={`fas fa-star ${star <= profile.average_rating ? 'filled' : ''}`}></i>
                ))}
              </div>
            <p>{profile.total_reviews} reviews</p>
            </div>

            <div className="profile-security">
  <h3>Security</h3>
  <div className="security-grid">
    <div className="security-item">
      <button className="security-btn" onClick={() => navigate('/change-password')}>
        Change Password
      </button>
    </div>
    <div className="security-item">
      
    </div>
  </div>
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