<?php

namespace WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WebSocketHandler implements MessageComponentInterface
{
    protected $clients;
    protected $rooms;
    protected $clientRooms; // Додаємо відстеження поточної кімнати клієнта
    protected $clientUsernames; // Додаємо відстеження імен користувачів

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->rooms = [];
        $this->clientRooms = []; // Клієнт -> поточна кімната
        $this->clientUsernames = []; // Клієнт -> ім'я користувача
        echo "WebSocket сервер запущено!!!!\n";
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Зберігаємо нове з'єднання
        $this->clients->attach($conn);
        echo "Нове з'єднання! ({$conn->resourceId})\n";
        
        // Відправляємо привітання
        $this->sendToClient($conn, [
            'type' => 'welcome',
            'message' => 'Ласкаво просимо до WebSocket сервера!',
            'timestamp' => date('Y-m-d H:i:s'),
            'clientId' => $conn->resourceId
        ]);

        // Відправляємо інформацію про кількість підключених клієнтів
        $this->broadcastSystemMessage("Клієнт {$conn->resourceId} підключився. Всього клієнтів: " . count($this->clients));
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        echo sprintf('Повідомлення від %d: %s' . "\n", $from->resourceId, $msg);

        // Парсимо JSON повідомлення
        $data = json_decode($msg, true);
        
        if (!$data) {
            $data = ['type' => 'message', 'content' => $msg];
        }

        // Додаємо метадані
        $data['timestamp'] = date('Y-m-d H:i:s');
        $data['from'] = $from->resourceId;

        // Обробляємо різні типи повідомлень
        switch ($data['type']) {
            case 'message':
                $this->handleChatMessage($from, $data);
                break;
            case 'join_room':
                $this->handleJoinRoom($from, $data);
                break;
            case 'leave_room':
                $this->handleLeaveRoom($from, $data);
                break;
            case 'private_message':
                $this->handlePrivateMessage($from, $data);
                break;
            case 'set_username':
                $this->handleSetUsername($from, $data);
                break;
            case 'get_users':
                $this->handleGetUsers($from, $data);
                break;
            case 'ping':
                $this->sendToClient($from, ['type' => 'pong', 'timestamp' => date('Y-m-d H:i:s')]);
                break;
            default:
                $this->handleChatMessage($from, $data);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // З'єднання закрито
        $this->clients->detach($conn);
        echo "З'єднання {$conn->resourceId} закрито\n";
        
        // Видаляємо клієнта з усіх кімнат
        $this->removeClientFromAllRooms($conn);
        
        // Видаляємо з відстеження кімнат та імен
        unset($this->clientRooms[$conn->resourceId]);
        unset($this->clientUsernames[$conn->resourceId]);
        
        // Повідомляємо інших клієнтів
        $username = $this->clientUsernames[$conn->resourceId] ?? "Користувач {$conn->resourceId}";
        $this->broadcastSystemMessage("{$username} відключився. Всього клієнтів: " . count($this->clients));
        
        // Відправляємо оновлений список користувачів
        $this->broadcastUsersList();
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "Помилка: {$e->getMessage()}\n";
        $conn->close();
    }

    protected function handleChatMessage(ConnectionInterface $from, $data)
    {
        // Отримуємо поточну кімнату клієнта
        $currentRoom = $this->clientRooms[$from->resourceId] ?? 'general';
        
        // Додаємо ім'я користувача до повідомлення
        $username = $this->clientUsernames[$from->resourceId] ?? "Користувач {$from->resourceId}";
        $data['username'] = $username;
        
        // Відправляємо повідомлення тільки клієнтам в тій самій кімнаті
        if (isset($this->rooms[$currentRoom])) {
            foreach ($this->rooms[$currentRoom] as $client) {
                if ($from !== $client) {
                    $this->sendToClient($client, $data);
                }
            }
        }

        // Підтвердження доставки відправнику
        $this->sendToClient($from, [
            'type' => 'delivery_status',
            'messageId' => $data['messageId'] ?? uniqid(),
            'status' => 'delivered',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    protected function handleJoinRoom(ConnectionInterface $client, $data)
    {
        $roomName = $data['room'] ?? 'general';
        
        // Видаляємо клієнта з попередньої кімнати
        $previousRoom = $this->clientRooms[$client->resourceId] ?? null;
        if ($previousRoom && isset($this->rooms[$previousRoom])) {
            $this->rooms[$previousRoom]->detach($client);
        }
        
        // Додаємо клієнта до нової кімнати
        if (!isset($this->rooms[$roomName])) {
            $this->rooms[$roomName] = new \SplObjectStorage;
        }
        
        $this->rooms[$roomName]->attach($client);
        $this->clientRooms[$client->resourceId] = $roomName;
        
        $this->sendToClient($client, [
            'type' => 'room_joined',
            'room' => $roomName,
            'message' => "Ви приєдналися до кімнати: {$roomName}",
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
        // Повідомляємо інших учасників кімнати
        $username = $this->clientUsernames[$client->resourceId] ?? "Користувач {$client->resourceId}";
        foreach ($this->rooms[$roomName] as $roomClient) {
            if ($roomClient !== $client) {
                $this->sendToClient($roomClient, [
                    'type' => 'user_joined_room',
                    'room' => $roomName,
                    'user' => $client->resourceId,
                    'username' => $username,
                    'message' => "{$username} приєднався до кімнати",
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            }
        }
        
        // Відправляємо оновлений список користувачів
        $this->broadcastUsersList();
    }

    protected function handleLeaveRoom(ConnectionInterface $client, $data)
    {
        $roomName = $data['room'] ?? 'general';
        
        if (isset($this->rooms[$roomName])) {
            $this->rooms[$roomName]->detach($client);
            
            // Видаляємо з відстеження кімнат
            if ($this->clientRooms[$client->resourceId] === $roomName) {
                unset($this->clientRooms[$client->resourceId]);
            }
            
            $this->sendToClient($client, [
                'type' => 'room_left',
                'room' => $roomName,
                'message' => "Ви покинули кімнату: {$roomName}",
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        }
    }

    protected function handlePrivateMessage(ConnectionInterface $from, $data)
    {
        $targetId = $data['to'] ?? null;
        
        if ($targetId) {
            foreach ($this->clients as $client) {
                if ($client->resourceId == $targetId) {
                    $this->sendToClient($client, [
                        'type' => 'private_message',
                        'from' => $from->resourceId,
                        'content' => $data['content'],
                        'timestamp' => date('Y-m-d H:i:s')
                    ]);
                    break;
                }
            }
        }
        
        // Підтвердження доставки приватного повідомлення
        $this->sendToClient($from, [
            'type' => 'delivery_status',
            'messageId' => $data['messageId'] ?? uniqid(),
            'status' => 'delivered',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    protected function sendToClient(ConnectionInterface $client, $data)
    {
        $client->send(json_encode($data));
    }

    protected function broadcastSystemMessage($message)
    {
        $data = [
            'type' => 'system',
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        foreach ($this->clients as $client) {
            $this->sendToClient($client, $data);
        }
    }

    protected function removeClientFromAllRooms(ConnectionInterface $client)
    {
        foreach ($this->rooms as $roomName => $roomClients) {
            if ($roomClients->contains($client)) {
                $roomClients->detach($client);
            }
        }
        
        // Видаляємо з відстеження кімнат
        unset($this->clientRooms[$client->resourceId]);
    }

    protected function handleSetUsername(ConnectionInterface $client, $data)
    {
        $username = $data['username'] ?? '';
        
        if ($username) {
            $this->clientUsernames[$client->resourceId] = $username;
            
            // Повідомляємо клієнта про успішне встановлення імені
            $this->sendToClient($client, [
                'type' => 'username_set',
                'username' => $username,
                'message' => "Ім'я встановлено: {$username}",
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            
            // Відправляємо оновлений список користувачів всім клієнтам
            $this->broadcastUsersList();
        }
    }

    protected function handleGetUsers(ConnectionInterface $client, $data)
    {
        $users = [];
        foreach ($this->clients as $c) {
            $username = $this->clientUsernames[$c->resourceId] ?? "Користувач {$c->resourceId}";
            $users[] = [
                'id' => $c->resourceId,
                'username' => $username,
                'room' => $this->clientRooms[$c->resourceId] ?? 'general'
            ];
        }
        
        $this->sendToClient($client, [
            'type' => 'users_list',
            'users' => $users,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    protected function broadcastUsersList()
    {
        $users = [];
        foreach ($this->clients as $client) {
            $username = $this->clientUsernames[$client->resourceId] ?? "Користувач {$client->resourceId}";
            $users[] = [
                'id' => $client->resourceId,
                'username' => $username,
                'room' => $this->clientRooms[$client->resourceId] ?? 'general'
            ];
        }
        
        $data = [
            'type' => 'users_list',
            'users' => $users,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        foreach ($this->clients as $client) {
            $this->sendToClient($client, $data);
        }
    }

    public function getConnectedClientsCount()
    {
        return count($this->clients);
    }

    public function getRoomsInfo()
    {
        $info = [];
        foreach ($this->rooms as $roomName => $roomClients) {
            $info[$roomName] = count($roomClients);
        }
        return $info;
    }
} 