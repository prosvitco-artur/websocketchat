import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const Message = ({ message }) => {
  const getMessageClass = () => {
    switch (message.type) {
      case 'own':
        return 'message-bubble message-own';
      case 'system':
        return 'message-bubble message-system';
      case 'private_message':
        return 'message-bubble message-private';
      case 'welcome':
        return 'message-bubble message-system';
      default:
        return 'message-bubble message-other';
    }
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case 'welcome':
        return '🎉';
      case 'system':
        return 'ℹ️';
      case 'private_message':
        return '🔒';
      case 'message':
        return '📨';
      default:
        return '💬';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm', { locale: uk });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-3"
    >
      <div className={getMessageClass()}>
        <div className="flex items-start gap-2">
          <span className="text-lg">{getMessageIcon()}</span>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {message.content || message.message}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {message.timestamp && (
                  <div className="text-xs opacity-60">
                    {formatTimestamp(message.timestamp)}
                  </div>
                )}
                {message.username && message.type !== 'own' && (
                  <div className="text-xs opacity-60">
                    Від: {message.username}
                  </div>
                )}
                {message.username && message.type === 'own' && (
                  <div className="text-xs opacity-60">
                    Ви: {message.username}
                  </div>
                )}
              </div>
              {message.type === 'own' && message.deliveryStatus && (
                <div className="text-xs text-gray-400">
                  {message.deliveryStatus === 'delivered' ? '✅' : '⏳'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Message; 