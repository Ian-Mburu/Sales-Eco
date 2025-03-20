import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../slices/MessageSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/pages/message.css';

const MessageButton = () => {
  const [messageContent, setMessageContent] = useState('');
  const [status, setStatus] = useState('idle');
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Get recipient user from location state
  const recipientUser = location.state?.user;

  useEffect(() => {
    console.log('🔍 Received recipient data:', recipientUser);

    if (!recipientUser?.id) {
      console.error('❌ No recipient user found in state');
      return; // Avoid redirect loop
    }
  }, [recipientUser]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !recipientUser?.id) {
      console.warn('⚠️ Message content or recipient is missing');
      return;
    }

    try {
      setStatus('loading');
      await dispatch(sendMessage({
        recipient: recipientUser.id, // ✅ Use verified user ID
        content: messageContent
      })).unwrap();

      setMessageContent(''); // Reset form on success
      setStatus('success');
      console.log('✅ Message sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setStatus('error');
    }
  };

  const handleMessageClick = () => {
    if (!currentUser?.id || !recipientUser?.id) {
      console.error('Missing user IDs for thread creation');
      return;
    }
  
    const participants = [currentUser.id, recipientUser.id].sort();
    const threadId = `thread_${participants.join('_')}`;
    navigate(`/messages/${threadId}`);
  };

  if (!recipientUser) {
    return <div className="error-message">Recipient not found.</div>;
  }

  return (
    <div className="message-widget">
      <h3>Message {recipientUser.username} (ID: {recipientUser.id})</h3>

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
        <div className="success-message">✅ Message sent successfully!</div>}
      
      {status === 'error' && 
        <div className="error-message">❌ Failed to send message.</div>}

      <button onClick={handleMessageClick} className="message-button">
        View Conversation
      </button>
    </div>
  );
};

export default MessageButton;
