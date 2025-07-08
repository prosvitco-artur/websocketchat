import React from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiWifiOff, FiActivity } from 'react-icons/fi';

const ConnectionStatus = ({ isConnected, error }) => {
  const getStatusColor = () => {
    if (error) return 'bg-red-500/20 border-red-500 text-red-300';
    if (isConnected) return 'bg-green-500/20 border-green-500 text-green-300';
    return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
  };

  const getStatusIcon = () => {
    if (error) return <FiWifiOff size={20} />;
    if (isConnected) return <FiWifi size={20} />;
    return <FiActivity size={20} />;
  };

  const getStatusText = () => {
    if (error) return 'Помилка з\'єднання';
    if (isConnected) return 'Підключено';
    return 'Відключено';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor()} backdrop-blur-lg`}
    >
      <motion.div
        animate={{ 
          scale: isConnected ? [1, 1.2, 1] : 1,
          rotate: isConnected ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          duration: 0.5, 
          repeat: isConnected ? Infinity : 0,
          repeatDelay: 2
        }}
      >
        {getStatusIcon()}
      </motion.div>
      <div>
        <div className="font-medium">{getStatusText()}</div>
        {error && (
          <div className="text-xs opacity-80 mt-1">{error}</div>
        )}
      </div>
    </motion.div>
  );
};

export default ConnectionStatus; 