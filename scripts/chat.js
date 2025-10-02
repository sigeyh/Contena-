// Chat Functions
function loadChat() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Load chat messages
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const userMessages = chatMessages.filter(msg => 
        msg.userId === currentUser.id || (msg.isFromAdmin && msg.targetUserId === currentUser.id)
    );
    
    displayChatMessages(userMessages);
    
    // Set up chat input
    document.getElementById('send-message').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Set up file upload
    document.getElementById('file-upload').addEventListener('change', handleFileUpload);
}

function displayChatMessages(messages) {
    const chatMessagesContainer = document.getElementById('chat-messages');
    
    if (messages.length === 0) {
        chatMessagesContainer.innerHTML = `
            <div class="no-messages">
                <p>No messages yet. Start a conversation with our support team!</p>
            </div>
        `;
        return;
    }
    
    // Sort messages by date
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    chatMessagesContainer.innerHTML = messages.map(message => `
        <div class="message ${message.isFromAdmin ? 'support' : 'user'}">
            <div class="message-content">${message.content}</div>
            ${message.file ? `<div class="message-file"><a href="${message.file.url}" target="_blank">${message.file.name}</a></div>` : ''}
            <div class="message-time">${formatMessageTime(message.timestamp)}</div>
        </div>
    `).join('');
    
    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const messageInput = document.getElementById('chat-input');
    const content = messageInput.value.trim();
    
    if (!content) return;
    
    // Save message
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const newMessage = {
        id: Date.now(),
        userId: currentUser.id,
        content: content,
        isFromAdmin: false,
        timestamp: new Date().toISOString()
    };
    
    chatMessages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    
    // Clear input and refresh
    messageInput.value = '';
    loadChat();
    
    // Simulate admin response after a delay
    setTimeout(simulateAdminResponse, 2000, currentUser.id);
}

function simulateAdminResponse(userId) {
    const responses = [
        "Thanks for your message! How can we help you today?",
        "We've received your message and will get back to you shortly.",
        "Is there anything specific you need assistance with?",
        "Our team is looking into your query and will respond soon."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const adminMessage = {
        id: Date.now(),
        userId: 0, // Admin user
        targetUserId: userId,
        content: randomResponse,
        isFromAdmin: true,
        timestamp: new Date().toISOString()
    };
    
    chatMessages.push(adminMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    
    // Refresh chat if user is still on chat page
    if (document.getElementById('chat-page').classList.contains('active')) {
        loadChat();
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // In a real app, this would upload the file to a server
    // For this demo, we'll just simulate the process
    
    showToast(`File "${file.name}" would be uploaded here`, 'info');
    
    // Reset file input
    e.target.value = '';
}

// Admin Chat Functions
function loadAdminChat() {
    // Load users who have sent messages
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Get unique user IDs from messages
    const userMessages = chatMessages.filter(msg => !msg.isFromAdmin);
    const userIds = [...new Set(userMessages.map(msg => msg.userId))];
    
    // Create user list with last message
    const chatUsers = userIds.map(userId => {
        const user = users.find(u => u.id === userId) || { name: 'Unknown User', id: userId };
        const userMsg = userMessages.filter(msg => msg.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        return {
            id: user.id,
            name: user.name,
            lastMessage: userMsg ? userMsg.content : 'No messages',
            lastMessageTime: userMsg ? userMsg.timestamp : null,
            unread: false // In a real app, this would track unread messages
        };
    });
    
    displayChatUsers(chatUsers);
    
    // Set up admin chat input
    document.getElementById('admin-send-message').addEventListener('click', sendAdminMessage);
    document.getElementById('admin-chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAdminMessage();
        }
    });
}

function displayChatUsers(users) {
    const chatUsersList = document.getElementById('chat-users-list');
    
    if (users.length === 0) {
        chatUsersList.innerHTML = '<p class="no-data">No active chats</p>';
        return;
    }
    
    // Sort by last message time (most recent first)
    users.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    
    chatUsersList.innerHTML = users.map(user => `
        <div class="chat-user" data-user-id="${user.id}">
            <div class="chat-user-name">${user.name}</div>
            <div class="chat-user-last-message">${user.lastMessage}</div>
            <div class="chat-user-time">${user.lastMessageTime ? formatMessageTime(user.lastMessageTime) : ''}</div>
        </div>
    `).join('');
    
    // Add event listeners to user items
    document.querySelectorAll('.chat-user').forEach(userEl => {
        userEl.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            selectChatUser(userId);
        });
    });
    
    // Select first user by default
    if (users.length > 0) {
        selectChatUser(users[0].id);
    }
}

function selectChatUser(userId) {
    // Update active user in UI
    document.querySelectorAll('.chat-user').forEach(userEl => {
        userEl.classList.remove('active');
    });
    
    document.querySelector(`.chat-user[data-user-id="${userId}"]`).classList.add('active');
    
    // Update header
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id == userId) || { name: 'Unknown User' };
    document.getElementById('selected-user').textContent = `Chat with ${user.name}`;
    
    // Load messages for this user
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const userMessages = chatMessages.filter(msg => 
        (msg.userId == userId && !msg.isFromAdmin) || 
        (msg.isFromAdmin && msg.targetUserId == userId)
    );
    
    displayAdminChatMessages(userMessages);
}

function displayAdminChatMessages(messages) {
    const adminChatMessages = document.getElementById('admin-chat-messages');
    
    if (messages.length === 0) {
        adminChatMessages.innerHTML = `
            <div class="no-messages">
                <p>No messages yet with this user.</p>
            </div>
        `;
        return;
    }
    
    // Sort messages by date
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    adminChatMessages.innerHTML = messages.map(message => `
        <div class="message ${message.isFromAdmin ? 'support' : 'user'}">
            <div class="message-content">${message.content}</div>
            ${message.file ? `<div class="message-file"><a href="${message.file.url}" target="_blank">${message.file.name}</a></div>` : ''}
            <div class="message-time">${formatMessageTime(message.timestamp)}</div>
        </div>
    `).join('');
    
    // Scroll to bottom
    adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
}

function sendAdminMessage() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const messageInput = document.getElementById('admin-chat-input');
    const content = messageInput.value.trim();
    
    if (!content) return;
    
    // Get selected user
    const selectedUserEl = document.querySelector('.chat-user.active');
    if (!selectedUserEl) {
        showToast('Please select a user to message', 'error');
        return;
    }
    
    const targetUserId = parseInt(selectedUserEl.getAttribute('data-user-id'));
    
    // Save message
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const newMessage = {
        id: Date.now(),
        userId: currentUser.id,
        targetUserId: targetUserId,
        content: content,
        isFromAdmin: true,
        timestamp: new Date().toISOString()
    };
    
    chatMessages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    
    // Clear input and refresh
    messageInput.value = '';
    selectChatUser(targetUserId);
}