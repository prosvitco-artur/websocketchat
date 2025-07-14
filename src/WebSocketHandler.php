<?php

namespace WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use WebSocket\Server\WebSocketHandler as ServerWebSocketHandler;

class WebSocketHandler implements MessageComponentInterface
{
    protected $serverHandler;

    public function __construct()
    {
        $this->serverHandler = new ServerWebSocketHandler();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->serverHandler->onOpen($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $this->serverHandler->onMessage($from, $msg);
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->serverHandler->onClose($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $this->serverHandler->onError($conn, $e);
    }

    public function getConnectedClientsCount()
    {
        return $this->serverHandler->getConnectedClientsCount();
    }

    public function getRoomsInfo()
    {
        return $this->serverHandler->getRoomsInfo();
    }
} 