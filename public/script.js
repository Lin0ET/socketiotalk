const socket = io('http://localhost:3000');

// 模擬當前使用者 ID（應從後端或登入系統獲取）
const userId = prompt('請輸入您的使用者 ID:');
socket.emit('addNewUser', userId);

// 更新線上使用者列表
socket.on('getOnlineUsers', (users) => {
    const recipientSelect = document.getElementById('recipient-select');
    recipientSelect.innerHTML = ''; // 清空選單

    users.forEach((user) => {
        if (user !== userId) { // 不顯示自己
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            recipientSelect.appendChild(option);
        }
    });
});

// 發送私人訊息
function sendMessage() {
    const recipientId = document.getElementById('recipient-select').value;
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (recipientId && message) {
        socket.emit('sendMessage', {
            senderId: userId,
            recipientId,
            message,
        });

        // 顯示在自己的聊天框
        const chatBox = document.getElementById('chat-box');
        const li = document.createElement('li');
        li.textContent = `您對 ${recipientId}: ${message}`;
        chatBox.appendChild(li);
        messageInput.value = '';
    }
}

// 接收私人訊息
socket.on('getMessage', ({ senderId, message }) => {
    const chatBox = document.getElementById('chat-box');
    const li = document.createElement('li');
    li.textContent = `來自 ${senderId}: ${message}`;
    chatBox.appendChild(li);
});
