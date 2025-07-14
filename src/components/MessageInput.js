import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiSmile } from 'react-icons/fi';

const MessageInput = ({ onSendMessage, disabled, onTyping, username }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '😍', '😭', '🤣', '😅'];

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
    } else if (onTyping) {
      onTyping();
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
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
            disabled={disabled || !username}
            className="input-field w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <FiSmile size={20} />
          </button>
        </div>
        <motion.button
          type="submit"
          disabled={disabled || !message.trim() || !username}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSend size={18} />
        </motion.button>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 left-0 bg-white/95 backdrop-blur-lg rounded-lg p-3 border border-white/20 shadow-xl z-10"
        >
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="text-2xl hover:bg-white/20 rounded p-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MessageInput; 