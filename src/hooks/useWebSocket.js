import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    try {
      socketRef.current = new WebSocket(url);
      
      socketRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          content: '✅ З\'єднання встановлено!',
          timestamp: new Date().toISOString()
        }]);
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, {
            id: Date.now(),
            ...data,
            timestamp: data.timestamp || new Date().toISOString()
          }]);
        } catch (e) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'message',
            content: event.data,
            timestamp: new Date().toISOString()
          }]);
        }
      };

      socketRef.current.onclose = () => {
        setIsConnected(false);
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          content: '❌ З\'єднання закрито',
          timestamp: new Date().toISOString()
        }]);
      };

      socketRef.current.onerror = (error) => {
        setIsConnected(false);
        setError('Помилка з\'єднання');
        console.error('WebSocket помилка:', error);
      };

    } catch (error) {
      setError('Не вдалося підключитися до сервера');
      console.error('Помилка підключення:', error);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message, type = 'message') => {
    if (socketRef.current && isConnected) {
      const data = {
        type,
        content: message,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      
      // Додаємо повідомлення відправника
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'own',
        content: `📤 ${message}`,
        timestamp: new Date().toISOString()
      }]);
      
      return true;
    }
    return false;
  }, [isConnected]);

  const sendPrivateMessage = useCallback((message, targetId) => {
    if (socketRef.current && isConnected) {
      const data = {
        type: 'private_message',
        to: targetId,
        content: message,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'own',
        content: `🔒 Приватно до ${targetId}: ${message}`,
        timestamp: new Date().toISOString()
      }]);
      
      return true;
    }
    return false;
  }, [isConnected]);

  const joinRoom = useCallback((roomName) => {
    if (socketRef.current && isConnected) {
      const data = {
        type: 'join_room',
        room: roomName,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [isConnected]);

  const leaveRoom = useCallback((roomName) => {
    if (socketRef.current && isConnected) {
      const data = {
        type: 'leave_room',
        room: roomName,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [isConnected]);

  const ping = useCallback(() => {
    if (socketRef.current && isConnected) {
      const data = {
        type: 'ping',
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    joinRoom,
    leaveRoom,
    ping,
    clearMessages
  };
}; 