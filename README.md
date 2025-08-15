# WebSocket Chat з React Frontend

Простий WebSocket чат з React frontend та Tailwind CSS. Підтримує реальний час повідомлень та красивий UI.

## 🚀 Швидкий старт

### Вимоги
- [Node.js](https://nodejs.org/) (для React frontend)
- WebSocket сервер (налаштуйте URL у `src/hooks/useWebSocket.js`)

### Встановлення

1. **Клонуйте проект:**
```bash
git clone <your-repo>
cd frontend
```

2. **Встановіть залежності:**
```bash
npm install
```

3. **Налаштуйте WebSocket URL:**
Відредагуйте `WEBSOCKET_URL` у файлі `src/hooks/useWebSocket.js`

4. **Запустіть додаток:**
```bash
npm start
```

### Використання

1. **React додаток** буде доступний за адресою: `http://localhost:3000`
2. **WebSocket URL** для підключення налаштовується в коді
3. **Функції:** надсилання повідомлень, очищення чату, статус з'єднання

## 📁 Структура проекту

```
frontend/
├── package.json            # Node.js залежності
├── tailwind.config.js      # Конфігурація Tailwind CSS
├── postcss.config.js       # Конфігурація PostCSS
├── src/
│   ├── index.js            # Точка входу React
│   ├── index.css           # Tailwind CSS стилі
│   ├── App.js              # Головний React компонент
│   ├── hooks/
│   │   └── useWebSocket.js # Кастомний хук для WebSocket
│   └── components/
│       ├── Message.js      # Компонент повідомлення
│       └── MessageInput.js # Компонент вводу повідомлення
├── public/
│   └── index.html         # HTML шаблон
└── README.md              # Цей файл
```

## 🔧 Налаштування

### WebSocket підключення
- **URL:** налаштовується в `src/hooks/useWebSocket.js`
- **Протокол:** WebSocket (ws:// або wss://)
- **Підтримка:** JSON повідомлення

### React Frontend
- **Порт:** 3000
- **Стилі:** Tailwind CSS
- **Анімації:** Framer Motion
- **Іконки:** React Icons

## 📡 API

### Типи повідомлень

#### Від клієнта:
```json
{
    "type": "message",
    "content": "Текст повідомлення",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Від сервера:
```json
{
    "type": "message",
    "content": "Текст повідомлення",
    "username": "Ім'я користувача",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🛠 Команди

### React Frontend
```bash
# Встановлення залежностей
npm install

# Запуск в режимі розробки
npm start

# Збірка для продакшену
npm run build
```

## 🎨 Особливості React Frontend

### Компоненти
- **Message** - повідомлення з різними типами та анімацією
- **MessageInput** - ввід повідомлень

### Функції
- ✅ Реальний час повідомлень
- ✅ Красивий UI з Tailwind CSS
- ✅ Анімації та переходи
- ✅ Автоскрол до нових повідомлень
- ✅ Статус з'єднання
- ✅ Очищення чату

## 🧪 Тестування

### React додаток
1. Відкрийте `http://localhost:3000` у браузері
2. Натисніть кнопку підключення
3. Введіть повідомлення та натисніть "Надіслати"

## 🚨 Розв'язання проблем

### Проблема: React не запускається
**Рішення:**
1. Перевірте, чи встановлені залежності: `npm install`
2. Перевірте порт 3000: `netstat -tulpn | grep 3000`
3. Перезапустіть: `npm start`

### Проблема: Не вдається підключитися до WebSocket
**Рішення:**
1. Перевірте WebSocket URL у `src/hooks/useWebSocket.js`
2. Переконайтеся, що WebSocket сервер запущений
3. Перевірте мережеве підключення

## 📚 Додаткові ресурси

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🤝 Внесок

1. Fork проект
2. Створіть feature branch
3. Commit зміни
4. Push до branch
5. Створіть Pull Request

## 📄 Ліцензія

MIT License

## 🎉 Готово!

Ваш WebSocket чат з React frontend готовий до використання! 

**Основні функції:**
- ✅ Реальний час повідомлень
- ✅ Красивий React UI з Tailwind CSS
- ✅ Анімації та переходи
- ✅ Адаптивний дизайн
- ✅ Простий та зрозумілий код 