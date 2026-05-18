/* ===================================================
   websocket.js - WebSocket Connection Handler
   
   YE FILE KYA KARTI HAI:
   - Server se WebSocket connection banati hai
   - Aane wale messages ko type ke hisaab se handle karti hai
   - Live ticker update karti hai
   - Price updates lagati hai product cards pe
   - Server status dashboard update karti hai
   - Chat messages handle karti hai
   
   SERVER SE AANE WALE MESSAGE TYPES:
   - welcome       → chatbot opening message
   - purchase      → "Ramesh bhaiya ne kuch kharida"
   - viewing       → "500 log dekh rahe hain"
   - urgency       → "Sirf 2 bache hain!"
   - review        → "Kisi ne review diya"
   - system        → "Hamster replace hua"
   - live          → "X users online"
   - cart          → "Kisi ne cart abandon kiya"
   - promo         → "Flash sale"
   - news          → "Breaking news"
   - support       → "Kisi ne support contact kiya"
   - price_update  → product prices update
   - server_status → hamster dashboard update
   - typing        → "BestBot type kar raha hai..."
   - chat_echo     → apna message wapas
   - chat_response → bot ka jawab
   - user_count    → online users count
   - play_sound    → server-requested sound
   =================================================== */

let ws = null;
let tickerMessages = []; // Last 20 ticker messages yahan store hote hain

// Connection banata hai, disconnect pe retry karta hai
function connectWebSocket() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${location.host}`);

    ws.onopen = () => {
        showToast('🔗 Chaos server se connected!', 'system');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWSMessage(data);
    };

    // Disconnect pe 3 seconds baad retry
    ws.onclose = () => {
        showToast('💀 Connection gaya! Hamster #3 so gaya.', 'error');
        setTimeout(connectWebSocket, 3000);
    };
}

// Message type ke hisaab se route karta hai
function handleWSMessage(data) {
    switch (data.type) {
        case 'welcome':
            // Chatbot ka pehla message
            addChatMessage(data.message, 'bot');
            break;

        // Ye sab live ticker events hain
        case 'purchase':
        case 'viewing':
        case 'urgency':
        case 'review':
        case 'system':
        case 'live':
        case 'cart':
        case 'promo':
        case 'news':
        case 'support':
            addTickerMessage(data.text);
            // 50% chance pe toast bhi dikhao
            if (Math.random() > 0.5) {
                showToast(data.text, data.type);
                playSound('notification');
            }
            break;

        case 'price_update':
            // Product cards pe live prices update karo
            updateLivePrices(data.products);
            break;

        case 'server_status':
            // Hamster dashboard update karo
            updateServerStatus(data);
            break;

        case 'typing':
            // "BestBot type kar raha hai..." indicator
            document.getElementById('chat-typing').textContent = data.message + '...';
            setTimeout(() => {
                document.getElementById('chat-typing').textContent = '';
            }, 3000);
            break;

        case 'chat_echo':
            // Apna message server ne confirm kiya - kuch nahi karna
            break;

        case 'chat_response':
            // Bot ka actual reply
            document.getElementById('chat-typing').textContent = '';
            let text = data.text;
            if (data.confidence) text += `\n[Confidence: ${data.confidence}]`;
            addChatMessage(text, 'bot', data.mood);
            // Unsolicited ads ke liye honk, normal messages ke liye notification
            playSound(data.unsolicited ? 'honk' : 'notification');
            break;

        case 'user_count':
            // Bottom ticker ke paas fake user count
            document.getElementById('online-count').textContent = data.message;
            break;

        case 'play_sound':
            // Server ne sound bajane ko kaha
            playSound(data.sound);
            break;
    }
}

// Live ticker mein naya message add karta hai
function addTickerMessage(text) {
    tickerMessages.push(text);
    if (tickerMessages.length > 20) tickerMessages.shift(); // Max 20 rakhte hain
    document.getElementById('ticker-messages').textContent =
        tickerMessages.join('   ●   ');
}

// Product cards pe live prices update karta hai (WebSocket se milte hain)
function updateLivePrices(products) {
    const priceElements = document.querySelectorAll('.live-price');
    priceElements.forEach((el, i) => {
        if (products[i]) {
            el.textContent = `${products[i].price}₹ ${products[i].trend}`;
            // Green agar price giri, red agar badhi - intentionally swapped
            el.style.color = products[i].trend === '📈' ? 'red' : 'green';
            // Font size bhi random change hoti hai
            el.style.fontSize = Math.random() > 0.5 ? '18px' : '10px';
        }
    });
}

// Hamster dashboard update karta hai (server_status message pe)
function updateServerStatus(data) {
    const grid = document.getElementById('hamster-grid');
    grid.innerHTML = data.hamsters.map(h => `
        <div class="hamster-card">
            <div class="hamster-emoji">🐹</div>
            <div class="hamster-name">${h.name}</div>
            <div class="hamster-state">${h.state}</div>
            <div class="hamster-rpm">${h.rpm} RPM</div>
        </div>
    `).join('');

    const stats = document.getElementById('server-stats');
    stats.innerHTML = `
        <div>🌡️ Temperature: ${data.temperature}</div>
        <div>⏱️ Uptime: ${data.uptime}</div>
        <div>❌ Aaj ke errors: ${data.totalErrors?.toLocaleString()}</div>
        <div>☕ Chai cups: ${data.chaiCups}</div>
        <div>🐛 Bugs fix hue: ${data.bugsFixed}</div>
        <div>🐛 Bugs create hue: ${data.bugsCreated}</div>
        <div>👥 Active users: ${data.activeUsers?.toLocaleString()}</div>
        <div>😊 Server ka mood: ${data.serverMood}</div>
    `;
}