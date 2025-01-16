const socket = io();

// 獲取 DOM 元素
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

// 當表單提交時
form.addEventListener('submit', (e) => {
    e.preventDefault(); // 防止重新加載頁面
    if (input.value) {
        socket.emit('chat message', input.value); // 發送訊息到伺服器
        input.value = ''; // 清空輸入框
    }
});

// 當收到新的訊息時
socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight; // 滾動到底部
});
