import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUser, FiMessageCircle } from 'react-icons/fi';

const UsersList = ({ users = [], onSendPrivateMessage }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');

  const handleSendPrivate = (e) => {
    e.preventDefault();
    if (selectedUser && privateMessage.trim()) {
      onSendPrivateMessage(privateMessage.trim(), selectedUser);
      setPrivateMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FiUsers size={20} />
        <h3 className="text-lg font-semibold text-white">Користувачі онлайн</h3>
        <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
          {users.length}
        </span>
      </div>

      {/* Users List */}
      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
        {users.length === 0 ? (
          <div className="text-center text-white/60 py-4">
            <FiUser size={24} className="mx-auto mb-2" />
            <p className="text-sm">Немає підключених користувачів</p>
          </div>
        ) : (
          users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium flex-1">
                Користувач {user.id}
              </span>
              <button
                onClick={() => setSelectedUser(user.id)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="Надіслати приватне повідомлення"
              >
                <FiMessageCircle size={14} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Private Message Form */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-3 bg-white/10 rounded-lg border border-white/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Приватне повідомлення до {selectedUser}
            </span>
            <button
              onClick={() => setSelectedUser('')}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSendPrivate} className="space-y-2">
            <input
              type="text"
              value={privateMessage}
              onChange={(e) => setPrivateMessage(e.target.value)}
              placeholder="Введіть приватне повідомлення..."
              className="input-field w-full text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!privateMessage.trim()}
                className="btn-primary px-3 py-2 text-sm flex-1"
              >
                Надіслати
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser('')}
                className="btn-secondary px-3 py-2 text-sm"
              >
                Скасувати
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default UsersList; 