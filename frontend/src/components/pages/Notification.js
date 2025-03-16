// NotificationIcon.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../slices/NotificationSlice';
import '../../styles/pages/notification.css';

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notifications);
  
  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="notification-bell">
      🔔
      {notifications.length > 0 && 
        <span className="badge">{notifications.length}</span>}
      
      <div className="notification-dropdown">
        {notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <p>{notification.message_content}</p>
            <small>
              From: {notification.sender_username} - 
              {new Date(notification.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;