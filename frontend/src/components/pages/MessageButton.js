// MessageButton.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../slices/MessageSlice';
import '../../styles/pages/message.css';

const MessageButton = ({ seller }) => {
  const [messageContent, setMessageContent] = useState('');
  const [status, setStatus] = useState('idle');
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !user || !seller) return;
    
    setStatus('loading');
    try {
      await dispatch(sendMessage({
        recipient: seller.user.id,
        content: messageContent
      })).unwrap();
      
      setMessageContent('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  if (!seller?.user?.id) return null;

  return (
    <div className="message-widget">
      <h3>Message {seller.user.username}</h3>
      
      <textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Write your message..."
        disabled={status === 'loading'}
      />

      <button 
        onClick={handleSendMessage}
        disabled={!messageContent.trim() || status === 'loading'}
        className="send-button"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && 
        <div className="success-message">Message sent successfully!</div>}
      
      {status === 'error' && 
        <div className="error-message">Failed to send message</div>}
    </div>
  );
};

export default MessageButton;