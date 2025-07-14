import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHash, FiPlus, FiX } from 'react-icons/fi';

const RoomSelector = ({ currentRoom, onRoomChange, onJoinRoom, username }) => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const defaultRooms = [
    { id: 'general', name: 'Загальний' },
    { id: 'random', name: 'Випадковий' },
    { id: 'help', name: 'Допомога' },
    { id: 'tech', name: 'Технології' }
  ];

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim() && username) {
      onJoinRoom(newRoomName.trim());
      setNewRoomName('');
      setShowCreateRoom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Кімнати</h3>
        <motion.button
          onClick={() => setShowCreateRoom(!showCreateRoom)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiPlus size={16} />
        </motion.button>
      </div>

      {/* Create Room Form */}
      {showCreateRoom && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCreateRoom}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Назва кімнати..."
              className="input-field flex-1 text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newRoomName.trim() || !username}
              className="btn-primary px-4 py-2 text-sm"
            >
              Створити
            </button>
            <button
              type="button"
              onClick={() => setShowCreateRoom(false)}
              className="btn-secondary px-4 py-2 text-sm"
            >
              <FiX size={16} />
            </button>
          </div>
        </motion.form>
      )}

      {/* Room List */}
      {!username && (
        <div className="text-xs text-yellow-300 bg-yellow-500/20 p-2 rounded-lg mb-3">
          ⚠️ Спочатку вкажіть ваше ім'я для приєднання до кімнат
        </div>
      )}
      <div className="space-y-2">
        {defaultRooms.map((room) => (
          <motion.button
            key={room.id}
            onClick={() => username ? onRoomChange(room.id) : null}
            disabled={!username}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              currentRoom === room.id
                ? 'bg-primary-500/30 border border-primary-400 text-primary-200'
                : username 
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-white/5 text-white/40 cursor-not-allowed'
            }`}
            whileHover={username ? { x: 5 } : {}}
            whileTap={username ? { scale: 0.95 } : {}}
          >
            <FiHash size={16} />
            <span className="font-medium">#{room.name}</span>
            {currentRoom === room.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-primary-400 rounded-full ml-auto"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector; 