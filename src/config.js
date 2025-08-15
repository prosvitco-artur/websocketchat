// Конфігурація для різних середовищ
export const config = {
  // WebSocket налаштування
  websocket: {
    // Локальна розробка
    development: {
      url: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080',
      secure: false
    },
    // GitHub Pages (production)
    production: {
      url: process.env.REACT_APP_WEBSOCKET_URL || 'wss://your-websocket-server.com',
      secure: true
    }
  },
  
  // Налаштування додатку
  app: {
    name: 'WebSocket Chat',
    version: '1.0.0'
  }
};

// Функція для отримання поточного середовища
export const getEnvironment = () => {
  // Спочатку перевіряємо змінну середовища
  if (process.env.REACT_APP_ENVIRONMENT) {
    return process.env.REACT_APP_ENVIRONMENT;
  }
  
  // Автоматичне визначення за доменом
  if (window.location.hostname === 'prosvitco-artur.github.io') {
    return 'production';
  }
  return 'development';
};

// Функція для отримання WebSocket URL
export const getWebSocketURL = () => {
  const env = getEnvironment();
  return config.websocket[env].url;
};

// Функція для перевірки, чи це GitHub Pages
export const isGitHubPages = () => {
  return getEnvironment() === 'production';
};
