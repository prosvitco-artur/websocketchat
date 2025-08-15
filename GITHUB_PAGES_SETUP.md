# Налаштування GitHub Pages

## 🚨 Важливо!

Для роботи на GitHub Pages потрібен **WebSocket сервер з підтримкою WSS (WebSocket Secure)**.

## 🔧 Налаштування

### 1. **WebSocket сервер**
Ваш WebSocket сервер повинен:
- Підтримувати WSS (WebSocket Secure)
- Бути доступним через HTTPS
- Мати публічну IP або домен

### 2. **Оновлення конфігурації**
В файлі `src/config.js` замініть:
```javascript
production: {
  url: 'wss://your-websocket-server.com', // ← Замініть на ваш сервер
  secure: true
}
```

### 3. **Змінні середовища**
Створіть файл `.env.local`:
```bash
REACT_APP_WEBSOCKET_URL=wss://your-websocket-server.com
REACT_APP_ENVIRONMENT=production
```

## 🚀 Деплой

### Автоматичний деплой
При кожному push до `main` гілки:
1. GitHub Actions автоматично збирає додаток
2. Деплоїть на GitHub Pages
3. Додаток доступний за адресою: `https://prosvitco-artur.github.io/websocketchat/`

### Ручний деплой
```bash
npm run deploy
```

## ⚠️ Обмеження GitHub Pages

- **Тільки статичні файли** - WebSocket сервер повинен бути окремо
- **HTTPS завжди** - WebSocket повинен бути WSS
- **Немає backend** - всі API повинні бути зовнішніми

## 🔍 Перевірка

1. **Локально**: `npm start` → `http://localhost:3000`
2. **GitHub Pages**: `https://prosvitco-artur.github.io/websocketchat/`
3. **WebSocket**: перевірте підключення до вашого сервера

## 🛠 Альтернативи

Якщо немає WSS сервера:
1. **Heroku** - безкоштовний хостинг
2. **Railway** - простий деплой
3. **DigitalOcean** - VPS з повним контролем
4. **AWS** - масштабованість

## 📝 Приклад налаштування

```javascript
// src/config.js
production: {
  url: 'wss://my-chat-server.herokuapp.com',
  secure: true
}
```

## ✅ Перевірний список

- [ ] WebSocket сервер підтримує WSS
- [ ] Сервер доступний через HTTPS
- [ ] Оновлено URL в `src/config.js`
- [ ] Створено `.env.local` (опціонально)
- [ ] Протестовано локально
- [ ] Протестовано на GitHub Pages
