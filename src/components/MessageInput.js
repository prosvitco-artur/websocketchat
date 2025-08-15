import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({ onSendMessage, disabled, username }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && username) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={username ? "Введіть повідомлення..." : "Спочатку вкажіть ваше ім'я..."}
            // disabled={disabled || !username}
            className="input-field w-full"
          />
        </div>
        <motion.button
          type="submit"
          // disabled={disabled || !message.trim() || !username}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSend size={18} />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput; 