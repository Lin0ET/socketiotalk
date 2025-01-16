const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// 線上使用者列表
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('使用者已連接:', socket.id);

    // 當使用者加入，存儲其 userId 和 socket.id
    socket.on('addNewUser', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log('線上使用者:', Array.from(onlineUsers.keys()));
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });

    // 處理私人訊息
    socket.on('sendMessage', ({ senderId, recipientId, message }) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('getMessage', {
                senderId,
                message,
            });
        } else {
            console.log('接收者不在線上:', recipientId);
        }
    });

    // 當使用者斷線時，移除其記錄
    socket.on('disconnect', () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        console.log('使用者斷線:', Array.from(onlineUsers.keys()));
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`伺服器已啟動：http://localhost:${PORT}`);
});
