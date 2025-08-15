import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPowerOff } from 'react-icons/lu'
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FaTrash } from 'react-icons/fa'


import { useWebSocket } from './hooks/useWebSocket';
import Message from './components/Message';
import MessageInput from './components/MessageInput';
import { getWebSocketURL, isGitHubPages } from './config';

const WEBSOCKET_URL = getWebSocketURL();

function App() {
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

  console.log(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isConnected) {
      getUsers();
    }
  }, [isConnected, getUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800 flex">
      <div className="bg-gradient-to-br w-full">
        content
      </div>

      <div className="card p-6 w-[600px] flex flex-col rounded-none">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
          <div>
            <p className="text-sm text-white/60">
              {messages.length} повідомлень
            </p>
            {isGitHubPages() && (
              <p className="text-xs text-blue-400 mt-1">
                🌐 GitHub Pages
              </p>
            )}
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

          <div ref={messagesEndRef} />
        </div>

        <MessageInput
          onSendMessage={sendMessage}
          disabled={!isConnected}
          username={username}
        />
      </div>
    </div>
  );
}

export default App; 