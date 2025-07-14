<?php

namespace WebSocket\Server;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WebSocketHandler implements MessageComponentInterface
{
    protected $clients;
    protected $roomManager;
    protected $userManager;
    protected $messageHandler;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->roomManager = new RoomManager();
        $this->userManager = new UserManager();
        echo "WebSocket сервер запущено!!!!\n";
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Зберігаємо нове з'єднання
        $this->clients->attach($conn);
        echo "Нове з'єднання! ({$conn->resourceId})\n";
        
        // Ініціалізуємо message handler
        $this->messageHandler = new MessageHandler($this->roomManager, $this->userManager, $this->clients);
        
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

        // Обробляємо повідомлення через MessageHandler
        $result = $this->messageHandler->handleMessage($from, $data);
        
        if ($result) {
            $this->processMessageResult($from, $result);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // З'єднання закрито
        $this->clients->detach($conn);
        echo "З'єднання {$conn->resourceId} закрито\n";
        
        // Видаляємо клієнта з усіх кімнат
        $this->roomManager->removeClientFromAllRooms($conn);
        
        // Видаляємо користувача
        $this->userManager->removeUser($conn);
        
        // Повідомляємо інших клієнтів
        $username = $this->userManager->getUsername($conn);
        $this->broadcastSystemMessage("{$username} відключився. Всього клієнтів: " . count($this->clients));
        
        // Відправляємо оновлений список користувачів
        $this->broadcastUsersList();
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "Помилка: {$e->getMessage()}\n";
        $conn->close();
    }

    protected function processMessageResult(ConnectionInterface $from, $result)
    {
        switch ($result['type']) {
            case 'message':
                // Відправляємо повідомлення отримувачам
                foreach ($result['recipients'] as $recipient) {
                    $this->sendToClient($recipient, $result['data']);
                }
                // Підтвердження доставки відправнику
                $this->sendToClient($from, $result['delivery_status']);
                break;
                
            case 'room_joined':
                // Повідомлення для клієнта
                $this->sendToClient($from, $result['client_message']);
                // Повідомлення для інших учасників кімнати
                foreach ($result['notifications'] as $notification) {
                    $this->sendToClient($notification['client'], $notification['data']);
                }
                // Відправляємо оновлений список користувачів
                $this->broadcastUsersList();
                break;
                
            case 'room_left':
                $this->sendToClient($from, $result['client_message']);
                break;
                
            case 'private_message':
                $this->sendToClient($result['recipient'], $result['data']);
                $this->sendToClient($from, $result['delivery_status']);
                break;
                
            case 'username_set':
                $this->sendToClient($from, $result['client_message']);
                $this->broadcastUsersList();
                break;
                
            case 'users_list':
                $this->sendToClient($from, $result['client_message']);
                break;
                
            case 'pong':
                $this->sendToClient($from, $result);
                break;
        }
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

    protected function broadcastUsersList()
    {
        $users = $this->userManager->getAllUsers($this->clients);
        
        // Додаємо інформацію про кімнати
        foreach ($users as &$user) {
            $user['room'] = $this->roomManager->getClientRoom($this->clients->current());
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
        return $this->roomManager->getRoomsInfo();
    }
} 