import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../slices/profileSlice';
import '../../styles/auth/update-profile.css';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    bio: '',
    county: '',
    facebook: '',
    twitter: '',
    image: null
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        county: profile.county || '',
        facebook: profile.facebook || '',
        twitter: profile.twitter || '',
        image: null
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formPayload.append(key, formData[key]);
      }
    });

    try {
      await dispatch(updateUserProfile(formPayload)).unwrap();
      navigate('/my-profile');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength="500"
          />
        </div>

        <div className="form-group">
          <label>Location (County)</label>
          <input
            type="text"
            name="county"
            value={formData.county}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Facebook Profile URL</label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Twitter Profile URL</label>
          <input
            type="url"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.image && (
            <img 
              src={URL.createObjectURL(formData.image)} 
              alt="Preview" 
              className="image-preview"
            />
          )}
        </div>

        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;