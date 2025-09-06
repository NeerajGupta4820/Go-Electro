// chatbot.jsx
import React, { useState, useRef } from 'react';
import { FaComment, FaTimes, FaExpand, FaCompress, FaPaperPlane } from 'react-icons/fa';
import './GoElectroChatbot.css';

const GoElectroChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am ElectroBuddy. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ bottom: 30, right: 30 });
  const [enlarged, setEnlarged] = useState(false);
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag logic
  const handleMouseDown = (e) => {
    // Only left mouse button
    if (e.button !== 0) return;
    setDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    document.body.style.userSelect = 'none';
  };
  const handleMouseUp = React.useCallback(() => {
    setDragging(false);
    document.body.style.userSelect = '';
  }, []);
  const handleMouseMove = React.useCallback((e) => {
    if (!dragging) return;
    setPosition({
      bottom: window.innerHeight - (e.clientY - offset.y) - dragRef.current.offsetHeight,
      right: window.innerWidth - (e.clientX - offset.x) - dragRef.current.offsetWidth
    });
  }, [dragging, offset]);
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Chat logic
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, I am a demo bot! Please contact support for real help.' }]);
    }, 700);
    setInput('');
  };

  return (
    <div
      className="goelectro-chatbot-container"
      ref={dragRef}
      style={{ position: 'fixed', bottom: position.bottom, right: position.right, zIndex: 9999 }}
      onMouseDown={handleMouseDown}
    >
      {isOpen ? (
        <div className={`goelectro-chatbot-box${enlarged ? ' enlarged' : ''}`}>  
          <button
            className="goelectro-chatbot-enlarge-abs"
            title={enlarged ? 'Shrink' : 'Enlarge'}
            onClick={() => setEnlarged(e => !e)}
          >
            {enlarged ? <FaCompress /> : <FaExpand />}
          </button>
          <div className="goelectro-chatbot-header">
            <div className="goelectro-chatbot-title">
              <FaComment style={{marginRight: '10px'}} />
              ElectroBuddy
            </div>
            <button className="goelectro-chatbot-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="goelectro-chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`goelectro-chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="goelectro-chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="goelectro-chatbot-input"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="goelectro-chatbot-send" onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <button className="goelectro-chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaComment size={24} />
        </button>
      )}
    </div>
  );
};

export default GoElectroChatbot;