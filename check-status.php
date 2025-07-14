<?php

require_once 'vendor/autoload.php';

use WebSocket\WebSocketHandler;

echo "🔍 Перевірка статусу WebSocket сервера\n";
echo "=====================================\n\n";

// Створюємо екземпляр обробника
$handler = new WebSocketHandler();

echo "📊 Статистика:\n";
echo "   - Підключені клієнти: " . $handler->getConnectedClientsCount() . "\n";
echo "   - Кімнати: " . json_encode($handler->getRoomsInfo(), JSON_UNESCAPED_UNICODE) . "\n\n";

echo "🌐 Для тестування:\n";
echo "   1. Відкрийте http://localhost:8000/test-chat.html\n";
echo "   2. Відкрийте ще одну вкладку з тим же URL\n";
echo "   3. Встановіть різні імена користувачів\n";
echo "   4. Відправте повідомлення\n\n";

echo "📝 Логи сервера:\n";
echo "   Для перегляду логів сервера використовуйте:\n";
echo "   tail -f /dev/null & php websocket-server.php --dev\n"; 