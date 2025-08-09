import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPowerOff } from 'react-icons/lu'
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaTrash } from 'react-icons/fa'


import { useWebSocket } from './hooks/useWebSocket';
import Message from './components/Message';
import MessageInput from './components/MessageInput';

const WEBSOCKET_URL = 'ws://localhost:8080';

function App() {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    isConnected,
    messages,
    username,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    getUsers
  } = useWebSocket(WEBSOCKET_URL);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getUsers();
    }
  }, [isConnected, getUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800 p-4">
      <div className="max-w-7xl mx-auto h-full">
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

        <div className="h-[80vh]">
          <div className="card p-6 w-[600px] h-full flex flex-col ml-auto">

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
              <div>
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
                  className={`p-2 rounded-lg transition-colors ${isConnected
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

            <div className="flex-1 overflow-y-auto scrollbar-thin mb-4">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-white/60 py-8"
                  >
                    <p>Очікування повідомлень...</p>
                  </motion.div>
                ) : (
                    messages.map((message) => (
                    <Message key={message.id} message={message} />
                  ))
                )}
              </AnimatePresence>

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

            <MessageInput
              onSendMessage={sendMessage}
              disabled={!isConnected}
              onTyping={handleTyping}
              username={username}
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-1 space-y-6">
          
          <div className="card p-6">
            <UserNameInput
              currentUsername={username}
              onSetUsername={handleSetUsername}
            />
          </div>

          <div className="card p-6">
            <ConnectionStatus isConnected={isConnected} error={error} username={username} />
          </div>

          <div className="card p-6">
            <UsersList
              users={users}
              onSendPrivateMessage={sendPrivateMessage}
            />
          </div>
        </div>
        </div>
        */}


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
    </div >
  );
}

export default App; 