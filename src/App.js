import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPowerOff } from 'react-icons/lu'
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaTrash } from 'react-icons/fa'


import { useWebSocket } from './hooks/useWebSocket';
import ConnectionStatus from './components/ConnectionStatus';
import Message from './components/Message';
import MessageInput from './components/MessageInput';
import RoomSelector from './components/RoomSelector';
import UsersList from './components/UsersList';
import UserNameInput from './components/UserNameInput';

const WEBSOCKET_URL = 'ws://localhost:8080';

function App() {
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const {
    isConnected,
    messages,
    error,
    currentRoom: wsCurrentRoom, // Отримуємо поточну кімнату з хука
    username,
    users, // Отримуємо список реальних користувачів
    setUsername,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    joinRoom,
    clearMessages,
    getUsers
  } = useWebSocket(WEBSOCKET_URL);

  // Функція для встановлення імені користувача з повідомленням
  const handleSetUsername = (newUsername) => {
    setUsername(newUsername);
    // Додаємо системне повідомлення про вхід користувача
    if (isConnected) {
      sendMessage(`👋 ${newUsername} приєднався до чату!`, 'system');
    }
  };

  // Синхронізуємо локальний стан з WebSocket хуком
  useEffect(() => {
    if (wsCurrentRoom && wsCurrentRoom !== currentRoom) {
      setCurrentRoom(wsCurrentRoom);
    }
  }, [wsCurrentRoom, currentRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle room changes
  const handleRoomChange = (roomName) => {
    if (currentRoom !== roomName && username) {
      setCurrentRoom(roomName);
      joinRoom(roomName);
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  // Отримуємо список користувачів при підключенні
  useEffect(() => {
    if (isConnected) {
      getUsers();
    }
  }, [isConnected, getUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🌐 WebSocket Chat
          </h1>
          <p className="text-white/80">
            Реальний час спілкування з React та Tailwind CSS
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Name Input */}
            <div className="card p-6">
              <UserNameInput
                currentUsername={username}
                onSetUsername={handleSetUsername}
              />
            </div>

            {/* Connection Status */}
            <div className="card p-6">
              <ConnectionStatus isConnected={isConnected} error={error} username={username} />
            </div>

            {/* Room Selector */}
            <div className="card p-6">
              <RoomSelector
                currentRoom={currentRoom}
                onRoomChange={handleRoomChange}
                onJoinRoom={joinRoom}
                username={username}
              />
            </div>

            {/* Users List */}
            <div className="card p-6">
              <UsersList
                users={users}
                onSendPrivateMessage={sendPrivateMessage}
              />
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="card p-6 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    #{currentRoom}
                  </h2>
                  <p className="text-sm text-white/60">
                    {messages.length} повідомлень
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={clearMessages}
                    className="btn-secondary p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Очистити повідомлення"
                  >
                    <FaTrash size={16} />
                  </motion.button>
                  <motion.button
                    onClick={isConnected ? disconnect : connect}
                    className={`p-2 rounded-lg transition-colors ${
                      isConnected 
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' 
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isConnected ? 'Відключитися' : 'Підключитися'}
                  >
                    {isConnected ? <LuPowerOff size={16} /> : <MdOutlineConnectWithoutContact size={16} />}
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollbar-thin mb-4">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-white/60 py-8"
                    >
                      {/* <FiRefreshCw size={48} className="mx-auto mb-4 animate-spin" /> */}
                      <p>Очікування повідомлень...</p>
                    </motion.div>
                  ) : (
                    messages.map((message) => (
                      <Message key={message.id} message={message} />
                    ))
                  )}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-white/60 italic mb-2"
                  >
                    Хтось друкує...
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <MessageInput
                onSendMessage={sendMessage}
                disabled={!isConnected}
                onTyping={handleTyping}
                username={username}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-white/60 text-sm"
        >
          <p>Створено з React, Tailwind CSS та WebSocket</p>
        </motion.div>
      </div>
    </div>
  );
}

export default App; 