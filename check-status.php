<?php

/**
 * Скрипт для перевірки статусу WebSocket сервера
 */

echo "🔍 Перевірка статусу WebSocket сервера\n";
echo "=====================================\n\n";

// Перевіряємо, чи запущений процес
$output = shell_exec('ps aux | grep websocket-server.php | grep -v grep');
if ($output) {
    echo "✅ WebSocket сервер запущений\n";
    echo "📊 Процеси:\n";
    echo $output;
} else {
    echo "❌ WebSocket сервер не запущений\n";
}

echo "\n";

// Перевіряємо порт 8080
$connection = @fsockopen('localhost', 8080, $errno, $errstr, 5);
if ($connection) {
    echo "✅ Порт 8080 доступний\n";
    fclose($connection);
} else {
    echo "❌ Порт 8080 недоступний: $errstr ($errno)\n";
}

echo "\n";

// Перевіряємо Lando статус
echo "🌐 Lando URLs:\n";
echo "- http://websocket-server.lndo.site/\n";
echo "- http://localhost:32779\n";
echo "- WebSocket: ws://localhost:8080\n";

echo "\n";

// Перевіряємо файли
$files = [
    'websocket-server.php' => 'Основний сервер',
    'src/WebSocketHandler.php' => 'Обробник WebSocket',
    'public/index.html' => 'Веб-клієнт',
    'vendor/autoload.php' => 'Composer autoload',
    'composer.json' => 'Composer конфігурація'
];

echo "📁 Перевірка файлів:\n";
foreach ($files as $file => $description) {
    if (file_exists($file)) {
        echo "✅ $description: $file\n";
    } else {
        echo "❌ $description: $file (відсутній)\n";
    }
}

echo "\n";

// Перевіряємо Composer залежності
if (file_exists('vendor/autoload.php')) {
    echo "📦 Composer залежності встановлені\n";
} else {
    echo "❌ Composer залежності не встановлені\n";
    echo "   Запустіть: lando composer install\n";
}

echo "\n";

// Інструкції
echo "📋 Інструкції:\n";
echo "1. Запустити сервер: lando websocket\n";
echo "2. Відкрити клієнт: http://websocket-server.lndo.site/\n";
echo "3. Тестувати: lando php test-websocket.php\n";
echo "4. Зупинити сервер: Ctrl+C в терміналі з сервером\n"; 