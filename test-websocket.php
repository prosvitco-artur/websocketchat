<?php

require_once 'vendor/autoload.php';

use Ratchet\Client\WebSocket;
use Ratchet\Client\Connector;
use React\EventLoop\Factory;

$loop = Factory::create();
$connector = new Connector($loop);

echo "🔍 Тестування WebSocket з'єднань...\n";

// Тест 1: Підключення до сервера
$connector('ws://localhost:8080')->then(
    function (WebSocket $conn) {
        echo "✅ Підключення успішне!\n";
        
        // Встановлюємо ім'я користувача
        $conn->send(json_encode([
            'type' => 'set_username',
            'username' => 'TestUser1',
            'timestamp' => date('Y-m-d H:i:s')
        ]));
        
        // Приєднуємося до кімнати
        $conn->send(json_encode([
            'type' => 'join_room',
            'room' => 'general',
            'timestamp' => date('Y-m-d H:i:s')
        ]));
        
        // Відправляємо тестове повідомлення
        $conn->send(json_encode([
            'type' => 'message',
            'content' => 'Тестове повідомлення від TestUser1',
            'room' => 'general',
            'timestamp' => date('Y-m-d H:i:s')
        ]));
        
        // Слухаємо відповіді
        $conn->on('message', function ($msg) {
            $data = json_decode($msg, true);
            echo "📨 Отримано: " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n";
        });
        
        // Закриваємо з'єднання через 5 секунд
        $conn->on('close', function () {
            echo "🔌 З'єднання закрито\n";
        });
        
    },
    function (Exception $e) {
        echo "❌ Помилка підключення: " . $e->getMessage() . "\n";
    }
);

$loop->run(); 