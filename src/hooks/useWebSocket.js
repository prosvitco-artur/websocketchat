import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chatUsername') || '';
  });
  const socketRef = useRef(null);

  const setUsernameWithStorage = useCallback((newUsername) => {
    setUsername(newUsername);
    localStorage.setItem('chatUsername', newUsername);
    
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
    console.log('connect');
    try {
      socketRef.current = new WebSocket(url);
      
      socketRef.current.onopen = () => {
        setIsConnected(true);
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          content: '✅ З\'єднання встановлено!',
          timestamp: new Date().toISOString()
        }]);
        
        if (username) {
          const data = {
            type: 'set_username',
            username: username,
            timestamp: new Date().toISOString()
          };
          socketRef.current.send(JSON.stringify(data));
        }
        
        setTimeout(() => {
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            getUsers();
          }
        }, 1000);
      };

      socketRef.current.onmessage = (event) => {
        console.log('onmessage');
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'delivery_status') {
            setMessages(prev => prev.map(msg => 
              msg.id === data.messageId 
                ? { ...msg, deliveryStatus: data.status }
                : msg
            ));
          } else if (data.type === 'users_list') {
            // Users list received but not used
          } else if (data.type === 'username_set') {
            console.log('Username set:', data.username);
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
        console.error('WebSocket помилка:', error);
      };

    } catch (error) {
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
        username: username,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(data));
      
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
  }, [isConnected, username]);

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
    username,
    setUsername: setUsernameWithStorage,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    getUsers
  };
}; 