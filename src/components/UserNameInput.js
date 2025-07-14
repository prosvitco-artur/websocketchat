import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCheck } from 'react-icons/fi';

const UserNameInput = ({ onSetUsername, currentUsername }) => {
  const [username, setUsername] = useState(currentUsername || '');
  const [isEditing, setIsEditing] = useState(!currentUsername);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username.trim());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing && currentUsername) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20"
      >
        <div className="flex items-center gap-2 text-white">
          <FiUser size={16} />
          <span className="font-medium">{currentUsername}</span>
        </div>
        <motion.button
          onClick={handleEdit}
          className="text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Змінити ім'я"
        >
          <FiUser size={14} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Ваше ім'я
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введіть ваше ім'я..."
              className="input-field w-full pr-10"
              autoFocus
              maxLength={20}
            />
            <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            type="submit"
            disabled={!username.trim()}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiCheck size={16} />
            Зберегти
          </motion.button>
          {currentUsername && (
            <motion.button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Скасувати
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default UserNameInput; 