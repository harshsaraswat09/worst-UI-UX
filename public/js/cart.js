/* ===================================================
   chat.js - BestBot 3000 Chatbot UI
   
   YE FILE KYA KARTI HAI:
   - Chat window open/close karta hai
   - Messages display karta hai (user + bot)
   - User ka message WebSocket se server ko bhejta hai
   - Server se aane wale responses display karta hai
   
   NOTE: Actual bot responses server.js mein hain
         WebSocket handling websocket.js mein hai
         Ye sirf UI layer hai
   =================================================== */

let chatOpen = false;

// Chat window toggle karta hai
function toggleChat() {
    chatOpen = !chatOpen;
    document.getElementById('chat-window').style.display = chatOpen ? 'block' : 'none';
    document.getElementById('chat-toggle').style.display = chatOpen ? 'none' : 'block';
    if (chatOpen) {
        document.getElementById('chat-input').focus();
        playSound('tada');
    }
}

// User ka message bhejta hai WebSocket ke through
function sendChat() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';

    // WebSocket se server ko bhejo (websocket.js mein ws variable hai)
    if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'chat', text }));
    }

    playSound('cash');
}

// Chat window mein message add karta hai
// sender: 'user' ya 'bot'
// mood: optional emoji (sirf bot messages ke liye)
function addChatMessage(text, sender, mood) {
    const container = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;

    let html = text.replace(/\n/g, '<br>');
    if (mood) html += `<span class="mood">${mood}</span>`;

    // Confidence percentage alag style mein dikhao
    if (sender === 'bot' && text.includes('Confidence:')) {
        const parts = html.split('[Confidence:');
        html = parts[0] + `<div class="confidence">Confidence: ${parts[1]}`;
    }

    msg.innerHTML = html;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight; // Auto-scroll to bottom
}