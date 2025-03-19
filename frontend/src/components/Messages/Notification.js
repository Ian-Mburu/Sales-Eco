// NotificationIcon.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../slices/NotificationSlice';
import '../../styles/pages/notification.css';
import ReplyModal from '../../components/Messages/ReplyModal';

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notifications);
  const [replyingTo, setReplyingTo] = useState(null);
  
  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleReply = (senderUsername) => {
    setReplyingTo(senderUsername);  // This triggers the modal to open
  };

  return (
    <div className="notification-bell">
      {replyingTo && (
        <ReplyModal 
          senderUsername={replyingTo}
          onClose={() => setReplyingTo(null)}
        />
      )}
      
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
            <button 
              onClick={() => handleReply(notification.sender_username)}
              className="reply-button"
            >
              Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;