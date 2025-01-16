const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 設定靜態檔案夾 (例如，客戶端的 HTML)
app.use(express.static('public'));

// 當有客戶端連接時
io.on('connection', (socket) => {
    console.log('使用者已連接:', socket.id);

    // 接收客戶端的訊息
    socket.on('chat message', (msg) => {
        console.log('收到訊息:', msg);

        // 廣播訊息給其他客戶端
        io.emit('chat message', msg);
    });

    // 當使用者斷線時
    socket.on('disconnect', () => {
        console.log('使用者已斷線:', socket.id);
    });
});

// 啟動伺服器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`伺服器已啟動： http://localhost:${PORT}`);
});
