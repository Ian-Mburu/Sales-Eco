// PublicProfile.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPublicProfile } from '../../slices/PublicProfileSlice';
import MessageButton from '../Messages/MessageButton';
import '../../styles/auth/profile.css';

const PublicProfile = () => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const { profile, status, error } = useSelector((state) => state.publicProfile);
    const currentUserId = useSelector(state => state.auth.user?.id);
  
    useEffect(() => {
      if (username) {
        dispatch(getPublicProfile(username));
      }
    }, [dispatch, username]);
  
    if (status === 'loading') return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  
    if (error) return (
      <div className="error-message">
        {error.detail || 'Failed to load profile'} - <button onClick={() => dispatch(getPublicProfile(username))}>Retry</button>
      </div>
    );
  
    if (!profile?.user?.id) return (
        <div className="error-message">
          {username ? `@${username} not found` : 'No username specified'}
        </div>
      );
  

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={profile.image || '/default-avatar.png'} 
            alt={profile.username} 
            className="profile-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="profile-info">
            <h1>{profile.username}</h1>
            <div className="profile-meta">
              {profile.join_date && (
                <span>
                  Joined: {new Date(profile.join_date).toLocaleDateString()}
                </span>
              )}
              {profile.county && (
                <span>
                  📍 {profile.county}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {profile.bio && (
          <div className="profile-section">
            <h3>About</h3>
            <p>{profile.bio}</p>
          </div>
        )}

        <div className="profile-section">
        <MessageButton 
            seller={profile} 
            currentUserId={currentUserId}  // Use the already fetched currentUserId
          />

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;