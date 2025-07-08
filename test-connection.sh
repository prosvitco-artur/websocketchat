#!/bin/bash

echo "🌐 Тестування зовнішнього доступу до WebSocket сервера"
echo "=================================================="

# Отримуємо IP адресу
IP_ADDRESS=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}' | cut -d'/' -f1)
echo "📍 IP адреса: $IP_ADDRESS"
echo "🔌 Порт: 8080"
echo ""

# Перевіряємо, чи сервер запущений
echo "🔍 Перевірка сервера..."
if pgrep -f "websocket-server.php" > /dev/null; then
    echo "✅ WebSocket сервер запущений"
else
    echo "❌ WebSocket сервер не запущений"
    echo "Запустіть: lando websocket"
    exit 1
fi

# Перевіряємо, чи порт слухає
echo "🔍 Перевірка порту..."
if netstat -tlnp | grep ":8080 " > /dev/null; then
    echo "✅ Порт 8080 відкритий"
else
    echo "❌ Порт 8080 не відкритий"
    exit 1
fi

# Тестуємо HTTP підключення
echo "🔍 Тестування HTTP підключення..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$IP_ADDRESS:8080)
if [ "$HTTP_RESPONSE" = "426" ]; then
    echo "✅ HTTP підключення працює (очікується WebSocket upgrade)"
else
    echo "❌ HTTP підключення не працює (код: $HTTP_RESPONSE)"
fi

echo ""
echo "📡 URL для підключення:"
echo "   ws://$IP_ADDRESS:8080"
echo ""
echo "🌐 Тестовий файл: test-external-websocket.html"
echo ""
echo "📱 Для тестування з іншого пристрою:"
echo "   1. Відкрийте браузер на іншому пристрої"
echo "   2. Перейдіть за адресою: http://$IP_ADDRESS:8080"
echo "   3. Або відкрийте test-external-websocket.html"
echo ""
echo "🔒 Брандмауер: $(sudo ufw status | head -1)" 