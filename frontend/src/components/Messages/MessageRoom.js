// MessageRoom.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMessageThread, sendMessage } from '../../slices/MessageSlice';
import '../../styles/pages/messageroom.css';

const MessageRoom = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const { currentThread, status,  } = useSelector((state) => state.messages);
  
  useEffect(() => {
    dispatch(getMessageThread(threadId));
  }, [dispatch, threadId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await dispatch(sendMessage({ threadId, content: newMessage }));
      setNewMessage('');
    }
  };

  return (
    <div className="message-room-container">
      <div className="message-header">
        <h2>Conversation with {currentThread?.participant?.username}</h2>
      </div>
      
      <div className="messages-list">
        {currentThread?.messages?.map(msg => (
          <div key={msg.id} className={`message-bubble ${msg.sender === currentThread.userId ? 'sent' : 'received'}`}>
            <p>{msg.content}</p>
            <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="message-input-area">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessageRoom;