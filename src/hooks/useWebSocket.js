import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chatUsername') || '';
  });
  const [users, setUsers] = useState([]); // Додаємо список реальних користувачів
  const socketRef = useRef(null);

  const setUsernameWithStorage = useCallback((newUsername) => {
    setUsername(newUsername);
    localStorage.setItem('chatUsername', newUsername);
    
    // Відправляємо ім'я на сервер
    if (socketRef.current && isConnected) {
      const data = {
        type: 'set_username',
        username: newUsername,
        timestamp: new Date().toISOString()
      };
      socketRef.current.send(JSON.stringify(data));
    }
  }, [isConnected]);

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
        
        // Автоматично відправляємо збережене ім'я користувача
        if (username) {
          const data = {
            type: 'set_username',
            username: username,
            timestamp: new Date().toISOString()
          };
          socketRef.current.send(JSON.stringify(data));
        }
        
        // Отримуємо список користувачів
        setTimeout(() => {
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            getUsers();
          }
        }, 1000); // Невелика затримка для встановлення імені
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'delivery_status') {
            // Оновлюємо статус доставки для конкретного повідомлення
            setMessages(prev => prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, deliveryStatus: data.status }
                : msg
            ));
          } else if (data.type === 'users_list') {
            // Оновлюємо список користувачів
            setUsers(data.users || []);
          } else if (data.type === 'username_set') {
            // Ім'я користувача встановлено
            console.log('Username set:', data.username);
            // Отримуємо оновлений список користувачів
            getUsers();
          } else {
            setMessages(prev => [...prev, {
              id: Date.now(),
              ...data,
              timestamp: data.timestamp || new Date().toISOString()
            }]);
          }
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
      const messageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const data = {
        type,
        content: message,
        messageId,
        room: currentRoom, // Додаємо інформацію про кімнату
        username: username, // Додаємо ім'я користувача
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      
      // Додаємо повідомлення відправника з індикатором доставки
      setMessages(prev => [...prev, {
        id: messageId,
        type: 'own',
        content: message,
        username: username,
        timestamp: new Date().toISOString(),
        deliveryStatus: 'sending' // pending, delivered, failed
      }]);
      
      return true;
    }
    return false;
  }, [isConnected, currentRoom, username]); // Додаємо username в залежності

  const sendPrivateMessage = useCallback((message, targetId) => {
    if (socketRef.current && isConnected) {
      const messageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const data = {
        type: 'private_message',
        to: targetId,
        content: message,
        messageId,
        username: username,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      
      setMessages(prev => [...prev, {
        id: messageId,
        type: 'own',
        content: `🔒 Приватно до ${targetId}: ${message}`,
        username: username,
        timestamp: new Date().toISOString(),
        deliveryStatus: 'sending'
      }]);
      
      return true;
    }
    return false;
  }, [isConnected, username]);

  const joinRoom = useCallback((roomName) => {
    if (socketRef.current && isConnected) {
      const data = {
        type: 'join_room',
        room: roomName,
        username: username,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      setCurrentRoom(roomName); // Оновлюємо поточну кімнату
      return true;
    }
    return false;
  }, [isConnected, username]);

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

  const getUsers = useCallback(() => {
    if (socketRef.current && isConnected) {
      const data = {
        type: 'get_users',
        timestamp: new Date().toISOString()
      };
      socketRef.current.send(JSON.stringify(data));
    }
  }, [isConnected]);

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
    currentRoom, // Експортуємо поточну кімнату
    username, // Експортуємо ім'я користувача
    users, // Експортуємо список користувачів
    setUsername: setUsernameWithStorage, // Експортуємо функцію для встановлення імені з збереженням
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    joinRoom,
    leaveRoom,
    ping,
    clearMessages,
    getUsers
  };
}; 