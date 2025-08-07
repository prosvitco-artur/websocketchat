# PHP WebSocket Server з React Frontend

Це повноцінний WebSocket чат з PHP сервером (Ratchet) та React frontend з Tailwind CSS. Підтримує зовнішній доступ та індикатор доставки повідомлень.

## 🚀 Швидкий старт

### Вимоги
- [Lando](https://docs.lando.dev/getting-started/installation.html)
- [Node.js](https://nodejs.org/) (для React frontend)
- Docker (встановлюється автоматично з Lando)

### Встановлення

1. **Клонуйте або створіть проект:**
```bash
git clone <your-repo>
cd websocket-server
```

2. **Запустіть Lando (PHP сервер):**
```bash
lando start
```

3. **Встановіть PHP залежності:**
```bash
lando composer install
```

4. **Встановіть Node.js залежності:**
```bash
npm install
```

5. **Запустіть WebSocket сервер:**
```bash
lando websocket
```

6. **Запустіть React додаток (в новому терміналі):**
```bash
npm start
```

### Використання

1. **WebSocket сервер** буде доступний на порту `8080`
2. **React додаток** буде доступний за адресою: `http://localhost:3000`
3. **WebSocket URL** для підключення: `ws://localhost:8080`
4. **Зовнішній доступ**: `ws://192.168.31.36:8080` (для інших пристроїв у мережі)

## 📁 Структура проекту

```
websocket-server/
├── .lando.yml              # Конфігурація Lando
├── composer.json           # PHP залежності
├── package.json            # Node.js залежності
├── tailwind.config.js      # Конфігурація Tailwind CSS
├── postcss.config.js       # Конфігурація PostCSS
├── websocket-server.php    # Основний WebSocket сервер
├── test-connection.sh      # Скрипт діагностики підключення
├── test-external-websocket.html # Тестовий веб-клієнт
├── CHANGES_SUMMARY.md      # Підсумок змін
├── EXTERNAL_ACCESS.md      # Документація зовнішнього доступу
├── REFACTORING_SUMMARY.md  # Підсумок рефакторингу
├── src/
│   ├── WebSocketHandler.php # Обробник WebSocket з'єднань
│   ├── index.js            # Точка входу React
│   ├── index.css           # Tailwind CSS стилі
│   ├── App.js              # Головний React компонент
│   ├── hooks/
│   │   └── useWebSocket.js # Кастомний хук для WebSocket
│   └── components/
│       ├── Message.js      # Компонент повідомлення
│       ├── MessageInput.js # Компонент вводу повідомлення
│       ├── ConnectionStatus.js # Статус з'єднання
│       ├── RoomSelector.js # Вибір кімнати
│       ├── UserNameInput.js # Ввід імені користувача
│       └── UsersList.js    # Список користувачів
├── public/
│   └── index.html         # HTML шаблон
├── test-websocket.php     # Тестовий клієнт
├── check-status.php       # Перевірка статусу сервера
└── README.md              # Цей файл
```

## 🔧 Налаштування

### Конфігурація Lando (.lando.yml)
- **PHP версія:** 8.2
- **WebSocket порт:** 8080
- **URL:** websocket-server.lndo.site
- **Зовнішній доступ:** налаштовано для доступу з інших пристроїв

### WebSocket сервер
- **Порт:** 8080
- **Протокол:** WebSocket (ws://)
- **Підтримка:** JSON повідомлення
- **Функції:** Кімнати, приватні повідомлення, системні повідомлення, індикатор доставки
- **Зовнішній доступ:** `0.0.0.0:8080`

### React Frontend
- **Порт:** 3000
- **Стилі:** Tailwind CSS
- **Анімації:** Framer Motion
- **Іконки:** React Icons
- **Форматування дат:** date-fns
- **Deploy:** GitHub Pages

## 📡 API

### Типи повідомлень

#### Від сервера:
```json
{
    "type": "welcome",
    "message": "Ласкаво просимо до WebSocket сервера!",
    "timestamp": "2024-01-01 12:00:00",
    "clientId": 123
}
```

```json
{
    "type": "delivery_status",
    "messageId": "unique_message_id",
    "status": "delivered",
    "timestamp": "2024-01-01 12:00:00"
}
```

```json
{
    "type": "system",
    "message": "Клієнт 123 підключився",
    "timestamp": "2024-01-01 12:00:00"
}
```

#### Від клієнта:
```json
{
    "type": "message",
    "content": "Текст повідомлення",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

```json
{
    "type": "join_room",
    "room": "general",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

```json
{
    "type": "private_message",
    "to": "123",
    "content": "Приватне повідомлення",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🛠 Команди

### Lando (PHP сервер)
```bash
# Запуск сервера
lando start

# Зупинка сервера
lando stop

# Перезапуск
lando restart

# Запуск WebSocket сервера
lando websocket

# Встановлення залежностей
lando composer install

# Оновлення залежностей
lando composer update

# Перевірка статусу
lando php check-status.php

# Тестування
lando php test-websocket.php

# Діагностика підключення
./test-connection.sh
```

### React Frontend
```bash
# Встановлення залежностей
npm install

# Запуск в режимі розробки
npm start

# Збірка для продакшену
npm run build

# Deploy на GitHub Pages
npm run deploy

# Тестування
npm test
```

## 🧪 Тестування

### React додаток
1. Відкрийте `http://localhost:3000` у браузері
2. Натисніть кнопку підключення
3. Введіть повідомлення та натисніть "Надіслати"
4. Тестуйте кімнати, приватні повідомлення та emoji

### Командний рядок
```bash
lando php test-websocket.php
```

### Зовнішній доступ
```bash
# Тестування з іншого пристрою
curl http://192.168.31.36:8080

# Відкрийте test-external-websocket.html на іншому пристрої
```

## 🎨 Особливості React Frontend

### Компоненти
- **ConnectionStatus** - відображення статусу з'єднання з анімацією
- **Message** - повідомлення з різними типами та анімацією
- **MessageInput** - ввід повідомлень з emoji picker
- **RoomSelector** - вибір та створення кімнат
- **UserNameInput** - ввід імені користувача
- **UsersList** - список користувачів з приватними повідомленнями

### Функції
- ✅ Реальний час повідомлень
- ✅ Підтримка кімнат
- ✅ Приватні повідомлення
- ✅ Emoji picker
- ✅ Анімації та переходи
- ✅ Адаптивний дизайн
- ✅ Автоскрол до нових повідомлень
- ✅ Індикатор друкування
- ✅ **Індикатор доставки повідомлень** (нова функція)
- ✅ Красивий UI з Tailwind CSS
- ✅ **Зовнішній доступ** (нова функція)

### 🆕 Індикатор доставки
Кожне повідомлення, відправлене користувачем, має індикатор статусу доставки:
- ⏳ **Відправляється** (жовтий) - повідомлення надіслано, очікується підтвердження
- ✅ **Доставлено** (зелений) - сервер підтвердив отримання повідомлення
- ❌ **Помилка** (червоний) - повідомлення не вдалося доставити

### 🌐 Зовнішній доступ
WebSocket сервер тепер доступний з інших пристроїв у локальній мережі:
- **URL для підключення**: `ws://192.168.31.36:8080`
- **Тестування**: відкрийте `test-external-websocket.html` на іншому пристрої
- **Безпека**: налаштовано брандмауер для порту 8080

## 🔍 Логування

WebSocket сервер виводить логи в консоль:
- Підключення клієнтів
- Отримані повідомлення
- Відключення клієнтів
- Помилки
- Статус доставки повідомлень

## 🚨 Розв'язання проблем

### Проблема: React не запускається
**Рішення:**
1. Перевірте, чи встановлені залежності: `npm install`
2. Перевірте порт 3000: `netstat -tulpn | grep 3000`
3. Перезапустіть: `npm start`

### Проблема: Не вдається підключитися
**Рішення:**
1. Перевірте статус: `lando php check-status.php`
2. Перевірте, чи запущений Lando: `lando status`
3. Перезапустіть сервер: `lando restart && lando websocket`
4. Запустіть діагностику: `./test-connection.sh`

### Проблема: Помилки Composer
**Рішення:**
```bash
lando composer install --ignore-platform-reqs
```

### Проблема: Порт зайнятий
**Рішення:**
Змініть порт у `websocket-server.php` та `.lando.yml`

### Проблема: WebSocket не працює
**Рішення:**
1. Перевірте, чи сервер запущений: `ps aux | grep websocket-server`
2. Перевірте порт: `netstat -tulpn | grep 8080`
3. Перезапустіть: `lando websocket`

### Проблема: Не можу підключитися з іншого пристрою
**Рішення:**
1. Перевірте IP адресу: `ip addr show | grep "inet " | grep -v 127.0.0.1`
2. Перевірте брандмауер: `sudo ufw status`
3. Дозвольте порт: `sudo ufw allow 8080`
4. Перевірте мережеве підключення між пристроями

## 📚 Додаткові ресурси

- [Ratchet Documentation](http://socketo.me/)
- [Lando Documentation](https://docs.lando.dev/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [GitHub Pages](https://pages.github.com/)

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
- ✅ Підтримка кімнат
- ✅ Приватні повідомлення
- ✅ Системні повідомлення
- ✅ Красивий React UI з Tailwind CSS
- ✅ Анімації та переходи
- ✅ Emoji picker
- ✅ Адаптивний дизайн
- ✅ **Індикатор доставки повідомлень**
- ✅ **Зовнішній доступ з інших пристроїв**
- ✅ Тестування з командного рядка
- ✅ Логування та моніторинг
- ✅ Deploy на GitHub Pages 