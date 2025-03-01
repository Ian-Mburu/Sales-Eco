import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile } from '../../slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (status === 'loading') return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {profile && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <img className="avatar-image" src={`http://localhost:8000/media/image/cat.png`} alt="Default Avatar" />
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
            <p><strong>Location:</strong> {profile.county || 'Not specified'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;