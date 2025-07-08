<?php

require_once 'vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use WebSocket\WebSocketHandler;

$port = 8080;
$host = '0.0.0.0';
$dev = false;

foreach ($argv as $arg) {
    if ($arg === '--dev') {
        $dev = true;
    } elseif (preg_match('/--port=(\d+)/', $arg, $matches)) {
        $port = (int)$matches[1];
    } elseif (preg_match('/--host=(.+)/', $arg, $matches)) {
        $host = $matches[1];
    }
}

if ($dev) {
    echo "🔧 Режим розробки активовано\n";
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Створюємо WebSocket сервер
$handler = new WebSocketHandler();

$server = IoServer::factory(
    new HttpServer(
        new WsServer($handler)
    ),
    $port,
    $host // Додаємо параметр host
);

echo "🚀 WebSocket сервер запущено на {$host}:{$port}\n";
echo "📡 URL: ws://{$host}:{$port}\n";
echo "⏹️  Для зупинки натисніть Ctrl+C\n\n";

if ($dev) {
    echo "📊 Статистика:\n";
    echo "   - Підключені клієнти: " . $handler->getConnectedClientsCount() . "\n";
    echo "   - Кімнати: " . json_encode($handler->getRoomsInfo()) . "\n\n";
}

// Запускаємо сервер
$server->run(); 