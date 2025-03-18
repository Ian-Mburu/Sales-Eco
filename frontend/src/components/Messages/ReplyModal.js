// ReplyModal.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../slices/MessageSlice';
import { fetchNotifications } from '../../slices/NotificationSlice';

const ReplyModal = ({ senderUsername, onClose }) => {
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(sendMessage({
        recipient: senderUsername,
        content: messageContent
      })).unwrap();

      setMessageContent('');
      onClose();
      // Refresh notifications
      dispatch(fetchNotifications());
    } catch (error) {
      setError(error.message || 'Failed to send message');
      console.error('Message send error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reply-modal">
      <div className="modal-content">
        <h3>Reply to {senderUsername}</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
            disabled={loading}
          />
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;