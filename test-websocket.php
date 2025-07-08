<?php

/**
 * Простий тестовий клієнт для WebSocket сервера
 * Використання: php test-websocket.php
 */

class WebSocketTestClient
{
    private $socket;
    private $host;
    private $port;
    private $path;

    public function __construct($host = 'localhost', $port = 8080, $path = '/')
    {
        $this->host = $host;
        $this->port = $port;
        $this->path = $path;
    }

    public function connect()
    {
        echo "🔌 Підключення до WebSocket сервера...\n";
        
        $address = "tcp://{$this->host}:{$this->port}";
        $this->socket = stream_socket_client($address, $errno, $errstr, 30);
        
        if (!$this->socket) {
            echo "❌ Помилка підключення: $errstr ($errno)\n";
            return false;
        }

        echo "✅ З'єднання встановлено\n";
        
        // Відправляємо WebSocket handshake
        $key = base64_encode(openssl_random_pseudo_bytes(16));
        $headers = "GET {$this->path} HTTP/1.1\r\n";
        $headers .= "Host: {$this->host}:{$this->port}\r\n";
        $headers .= "Upgrade: websocket\r\n";
        $headers .= "Connection: Upgrade\r\n";
        $headers .= "Sec-WebSocket-Key: {$key}\r\n";
        $headers .= "Sec-WebSocket-Version: 13\r\n";
        $headers .= "\r\n";

        fwrite($this->socket, $headers);
        
        // Читаємо відповідь
        $response = fread($this->socket, 2048);
        
        if (strpos($response, '101 Switching Protocols') !== false) {
            echo "✅ WebSocket handshake успішний\n";
            return true;
        } else {
            echo "❌ Помилка WebSocket handshake\n";
            echo "Відповідь: $response\n";
            return false;
        }
    }

    public function send($message)
    {
        if (!$this->socket) {
            echo "❌ Немає активного з'єднання\n";
            return false;
        }

        $frame = $this->createFrame($message);
        fwrite($this->socket, $frame);
        echo "📤 Відправлено: $message\n";
        return true;
    }

    public function receive()
    {
        if (!$this->socket) {
            return false;
        }

        $data = fread($this->socket, 2048);
        if ($data) {
            $message = $this->parseFrame($data);
            echo "📥 Отримано: $message\n";
            return $message;
        }
        return false;
    }

    public function close()
    {
        if ($this->socket) {
            fclose($this->socket);
            echo "🔌 З'єднання закрито\n";
        }
    }

    private function createFrame($payload)
    {
        $length = strlen($payload);
        $frame = chr(129); // FIN + text frame
        
        if ($length <= 125) {
            $frame .= chr($length);
        } elseif ($length <= 65535) {
            $frame .= chr(126) . pack('n', $length);
        } else {
            $frame .= chr(127) . pack('J', $length);
        }
        
        return $frame . $payload;
    }

    private function parseFrame($data)
    {
        $opcode = ord($data[0]) & 0x0F;
        $length = ord($data[1]) & 0x7F;
        $offset = 2;
        
        if ($length === 126) {
            $length = unpack('n', substr($data, 2, 2))[1];
            $offset = 4;
        } elseif ($length === 127) {
            $length = unpack('J', substr($data, 2, 8))[1];
            $offset = 10;
        }
        
        $payload = substr($data, $offset, $length);
        return $payload;
    }
}

// Тестування
echo "🧪 Тестування WebSocket сервера\n";
echo "================================\n\n";

$client = new WebSocketTestClient();

if ($client->connect()) {
    // Тест 1: Відправка простого повідомлення
    echo "\n📝 Тест 1: Відправка повідомлення\n";
    $client->send(json_encode([
        'type' => 'message',
        'content' => 'Привіт з тестового клієнта!',
        'timestamp' => date('Y-m-d H:i:s')
    ]));
    
    // Очікуємо відповідь
    sleep(1);
    $client->receive();
    
    // Тест 2: Ping
    echo "\n🏓 Тест 2: Ping\n";
    $client->send(json_encode([
        'type' => 'ping',
        'timestamp' => date('Y-m-d H:i:s')
    ]));
    
    sleep(1);
    $client->receive();
    
    // Тест 3: Приєднання до кімнати
    echo "\n🚪 Тест 3: Приєднання до кімнати\n";
    $client->send(json_encode([
        'type' => 'join_room',
        'room' => 'test-room',
        'timestamp' => date('Y-m-d H:i:s')
    ]));
    
    sleep(1);
    $client->receive();
    
    echo "\n✅ Тестування завершено\n";
} else {
    echo "❌ Не вдалося підключитися до сервера\n";
    echo "Переконайтеся, що WebSocket сервер запущений:\n";
    echo "  lando websocket\n";
}

$client->close(); 