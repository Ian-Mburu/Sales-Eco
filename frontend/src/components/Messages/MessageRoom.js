import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMessageThread, sendMessage } from '../../slices/MessageSlice';
import '../../styles/pages/messageroom.css';

const MessageRoom = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const { currentThread, status } = useSelector((state) => state.messages);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getMessageThread(threadId));
  }, [dispatch, threadId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await dispatch(sendMessage({ 
        threadId, 
        content: newMessage,
        recipient: currentThread.participant.id
      }));
      setNewMessage('');
    }
  };

  const groupMessagesBySender = () => {
    return currentThread?.messages?.reduce((groups, message) => {
      const senderId = message.sender.id;
      if (!groups[senderId]) {
        groups[senderId] = {
          user: message.sender,
          messages: []
        };
      }
      groups[senderId].messages.push(message);
      return groups;
    }, {});
  };

  const messageGroups = groupMessagesBySender() || {};

  return (
    <div className="message-room-container">
      <div className="message-header">
        <h2>
          <img 
            src={currentThread?.participant?.avatar} 
            alt={currentThread?.participant?.username}
            className="user-avatar"
          />
          Conversation with {currentThread?.participant?.username}
        </h2>
      </div>
      
      <div className="messages-list">
        {Object.values(messageGroups).map(group => (
          <div key={group.user.id} className="message-group">
            <div className="user-header">
              <img 
                src={group.user.avatar} 
                alt={group.user.username}
                className="user-avatar"
              />
              <h4>{group.user.username}</h4>
            </div>
            {group.messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message-bubble ${
                  msg.sender.id === user.id ? 'sent' : 'received'
                }`}
              >
                <p>{msg.content}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="message-input-area">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <button 
          onClick={handleSend} 
          disabled={status === 'loading'}
          className="send-button"
        >
          {status === 'loading' ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessageRoom;