#!/bin/bash

echo "🚀 Запуск WebSocket Chat з React Frontend"
echo "========================================"

# Перевіряємо, чи Lando запущений
if ! lando status > /dev/null 2>&1; then
    echo "📦 Запуск Lando..."
    lando start
else
    echo "✅ Lando вже запущений"
fi

# Встановлюємо PHP залежності
echo "📦 Перевірка PHP залежностей..."
if [ ! -d "vendor" ]; then
    echo "📦 Встановлення PHP залежностей..."
    lando composer install
else
    echo "✅ PHP залежності вже встановлені"
fi

# Встановлюємо Node.js залежності
echo "📦 Перевірка Node.js залежностей..."
if [ ! -d "node_modules" ]; then
    echo "📦 Встановлення Node.js залежностей..."
    npm install
else
    echo "✅ Node.js залежності вже встановлені"
fi

# Запускаємо WebSocket сервер у фоновому режимі
echo "🔌 Запуск WebSocket сервера..."
lando websocket &
WEBSOCKET_PID=$!

# Чекаємо трохи, щоб сервер запустився
sleep 3

# Перевіряємо, чи сервер запущений
if ps -p $WEBSOCKET_PID > /dev/null; then
    echo "✅ WebSocket сервер запущений (PID: $WEBSOCKET_PID)"
else
    echo "❌ Помилка запуску WebSocket сервера"
    exit 1
fi

# Запускаємо React додаток у фоновому режимі
echo "⚛️  Запуск React додатку..."
npm start &
REACT_PID=$!

# Чекаємо трохи, щоб React запустився
sleep 5

# Перевіряємо, чи React запущений
if ps -p $REACT_PID > /dev/null; then
    echo "✅ React додаток запущений (PID: $REACT_PID)"
else
    echo "❌ Помилка запуску React додатку"
    kill $WEBSOCKET_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Проект успішно запущений!"
echo "=========================="
echo "🌐 React додаток: http://localhost:3000"
echo "🔌 WebSocket сервер: ws://localhost:8080"
echo "📊 Статус: lando php check-status.php"
echo ""
echo "Для зупинки натисніть Ctrl+C"

# Функція очищення при завершенні
cleanup() {
    echo ""
    echo "🛑 Зупинка проекту..."
    kill $WEBSOCKET_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    echo "✅ Проект зупинено"
    exit 0
}

# Обробка сигналів для коректного завершення
trap cleanup SIGINT SIGTERM

# Очікуємо завершення
wait 