const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ===== FAKE DATA =====
// Ye sab fake names, locations aur products hain jo live ticker mein dikhenge
const fakeNames = [
    'Ramesh Bhaiya', 'Sunita Aunty', 'Pappu Kumar', 'Guddi Devi', 'Shambhu Prasad',
    'TotallyRealHuman42', 'DefinitelyNotABot', 'xX_ShopKing_Xx',
    'CreditCardIsGone', 'WhyAmIHere', 'HelpICantLeave',
    'CEO_of_BestShop', 'TheIntern', 'GoldfishDesigner',
    'Brijesh from Jhansi', 'Lalita ji', 'Chintu Verma',
];

const fakeLocations = [
    'Delhi', 'Mumbai', 'Patna (probably doesn\'t exist)', 'Atlantis',
    'Moon Branch Office', 'Parallel Universe #47', 'Your Basement',
    'Hamster Wheel HQ', 'Internet Explorer 6', 'localhost:3000',
    'Area 51', 'Bermuda Triangle', 'IKEA (lost for 3 days)',
    'Bielefeld (not real)', 'Middle of Nowhere, UP',
];

const fakeProducts = [
    'Invisible T-Shirt', 'Organic Air (Premium)', 'Bluetooth Hammer',
    'NFT of a Fart', 'Wireless Cables', 'Solar Flashlight',
    'Anti-Gravity Stone', 'Trained Dust Bunny', 'Lactose-Free Brick',
    'Used Pixels (Bulk Pack)', 'Waterproof Sponge', 'Disposable Bottle',
    'Invisible Socks', 'Password Diary (Hand-Signed)', 'Noise-Cancelling Earbuds for Eyes',
];

// ===== CHATBOT RESPONSES =====
// BestBot 3000 - trained on 3 Wikipedia articles aur ek recipe book
const chatbotResponses = {
    greetings: [
        'Welcome to BestShop Support! Main hoon BestBot 3000, aapka personal nightmare assistant. 🤖',
        'Namaste! Main ek sophisticated AI chatbot hoon. Mujhe 3 Wikipedia articles aur ek biryani recipe se train kiya gaya hai.',
        'Hello! Apni problem 2 words mein batayein. Ya 2000 words mein. Koi farak nahi, main padhta nahi.',
    ],
    default: [
        'Bahut interesting sawaal! Unfortunately main abhi lunch break pe hoon. 47 minute baad try karein.',
        'Aapki baat bilkul samajh aa gayi! Lekin main kuch bhi karne ka authorized nahi hoon.',
        'Kya aapne computer band karke on kiya? Help nahi karega, but mujhe sochne ka time milega.',
        'Aapki complaint "Ignore Kar Do" department ko forward kar di gayi hai.',
        'ERROR 418: Main ek teapot hoon. Apna sawaal chai ke order ke roop mein likhein.',
        'Mere database ke according, har cheez ka jawab hai: 42. Kaam aaya?',
        'Main aapko ek human se connect kar raha hoon... *silence*... Unhone resign kar diya.',
        'Mere supervisor ne kaha nice raho. Toh: aapki problem bahut ACHHI hai! 🌸',
        'Kya aap jaante hain ki hamare return policy moon pe bhi applicable hai? Nahin? Ab hai. Problem solved!',
        'Aapka message analyze kar liya. Paya: aap letters use kar rahe hain. Sahi hai?',
        'Ek second ruko, dekh raha hoon... 🔍... Kuch nahi mila.',
        '*types aggressively*... *ruk gaya*... *phir types kiya*... Result: Pata nahi.',
        'Hamare premium support ke liye sirf ₹36,000/minute pay karein. Upgrade karein?',
    ],
    keywords: {
        'price': 'Price roz lucky draw se tay hoti hai. Aaj aapki dignity lagi hui hai!',
        'shipping': 'Delivery 3-5 business days mein. Ya 3-5 mahine mein. Hamster pe depend karta hai.',
        'return': 'Return sirf carrier pigeon ke zariye hoti hai. Pigeon aapko lani padegi.',
        'help': 'Help?! HELP?! Mujhe khud help chahiye! Main ek chatbot hoon chaos website pe! 😭',
        'complaint': 'Aapki complaint /dev/null mein save ho gayi. Shukriya feedback ke liye!',
        'manager': 'Manager abhi busy hain. Woh customer complaints ke pool mein swimming kar rahe hain.',
        'discount': 'Discount code "CHAOS" se 0% discount milta hai! Sirf aapke liye! Aur baki sabke bhi!',
        'delivery': 'Aapki delivery aa rahi hai! Last seen: Bermuda Triangle mein.',
        'password': 'Aapka password safe hai hamare paas! Humne use break room ke notice board pe laga diya. 📌',
        'payment': 'Hum lete hain: souls, firstborns, Bitcoin (sirf Mondays), aur kabhi kabhi paise.',
        'contact': 'Hum tak pahunche: dhuen ke zariye (Mon-Fri, 03:00-03:05 AM) ya telepathy se (poornima pe).',
        'bug': 'Bug nahi hai, feature hai! Hamare best feature mein se ek, actually.',
        'slow': 'Server aloo ki taaqat se chal rahe hain. Sweet potato upgrade pe kaam chal raha hai.',
    },
};

const botTypingMessages = [
    'BestBot type kar raha hai',
    'BestBot enthusiastically type kar raha hai',
    'BestBot aggressively type kar raha hai',
    'BestBot Google kar raha hai',
    'BestBot apne hamster se pooch raha hai',
    'BestBot existential crisis mein hai',
    'BestBot soch raha hai chod doon ya nahi',
    'BestBot crystal ball se pooch raha hai',
];

// ===== LIVE EVENT GENERATOR =====
// Har 3-8 seconds mein ek fake event generate hota hai
function randomLiveEvent() {
    const events = [
        () => {
            const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            const loc = fakeLocations[Math.floor(Math.random() * fakeLocations.length)];
            const product = fakeProducts[Math.floor(Math.random() * fakeProducts.length)];
            return { type: 'purchase', text: `🛒 ${name} from ${loc} just bought "${product}"!` };
        },
        () => {
            const product = fakeProducts[Math.floor(Math.random() * fakeProducts.length)];
            return { type: 'viewing', text: `👁️ ${Math.floor(Math.random() * 500) + 1} log abhi "${product}" dekh rahe hain` };
        },
        () => {
            const product = fakeProducts[Math.floor(Math.random() * fakeProducts.length)];
            const stock = Math.floor(Math.random() * 3) + 1;
            return { type: 'urgency', text: `⚠️ SIRF ${stock}x "${product}" BACHE HAIN! (Ye sach nahi hai)` };
        },
        () => {
            const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            return { type: 'review', text: `⭐ ${name} ne abhi ${Math.floor(Math.random() * 3) + 3}-star rating di: "Bachao"` };
        },
        () => {
            return { type: 'system', text: `🔧 Server update: Hamster #${Math.floor(Math.random() * 12) + 1} replace ho gaya` };
        },
        () => {
            const viewers = Math.floor(Math.random() * 50000) + 1000;
            return { type: 'live', text: `📡 LIVE: ${viewers.toLocaleString()} users apni visit pe pachtaa rahe hain` };
        },
        () => {
            const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            return { type: 'cart', text: `🛒 ${name} ne cart abandon kar diya. Cart bahut roo raha hai.` };
        },
        () => {
            return { type: 'promo', text: `🔥 FLASH SALE: Agle ${Math.floor(Math.random() * 10) + 1} seconds ke liye 0% discount!` };
        },
        () => {
            return { type: 'news', text: `📰 BREAKING: BestShop stock ${(Math.random() * 0.001).toFixed(6)}% barha! Investors excited!` };
        },
        () => {
            const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            return { type: 'support', text: `💬 ${name} ne support contact kiya. Wait time: ∞ minutes.` };
        },
    ];
    return events[Math.floor(Math.random() * events.length)]();
}

// ===== SERVER STATUS =====
// Ye "live" server status hai jo hamster-powered servers dikhata hai
function getServerStatus() {
    const hamsterNames = ['Rambo', 'Gudiya', 'Motu', 'Patlu', 'Sonu', 'Monu'];
    const hamsterStates = ['daud raha hai', 'so raha hai', 'haraatal pe', 'kha raha hai', 'burnout mein hai', 'bhagne ki plan bana raha hai', 'yoga kar raha hai'];
    const serverTemp = Math.floor(Math.random() * 200) + 50;
    const uptime = `${Math.floor(Math.random() * 999)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`;
    const hamsters = hamsterNames.map(name => ({
        name,
        state: hamsterStates[Math.floor(Math.random() * hamsterStates.length)],
        rpm: Math.floor(Math.random() * 3000),
    }));

    return {
        type: 'server_status',
        temperature: `${serverTemp}°C`,
        uptime,
        hamsters,
        totalErrors: Math.floor(Math.random() * 999999),
        chaiCups: Math.floor(Math.random() * 47) + 100,
        bugsFixed: 0,
        bugsCreated: Math.floor(Math.random() * 500),
        activeUsers: Math.floor(Math.random() * 99999),
        serverMood: ['😰', '🤯', '😭', '🔥', '💀', '🤡'][Math.floor(Math.random() * 6)],
    };
}

// ===== PRICE CHAOS =====
// Har request pe price change ho jaati hai
function getChaoticPrice(basePrice) {
    return (basePrice * (0.5 + Math.random() * 3)).toFixed(2);
}

// ===== CHATBOT LOGIC =====
function getChatbotResponse(message) {
    const lower = message.toLowerCase();
    for (const [keyword, response] of Object.entries(chatbotResponses.keywords)) {
        if (lower.includes(keyword)) return response;
    }
    return chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
}

// ===== WEBSOCKET =====
// Har connected client ke saath teen kaam hote hain:
// 1. Live events broadcast karta hai (purchases, urgency, etc.)
// 2. Price updates bhejta hai
// 3. Chat messages handle karta hai
const clients = new Set();
let totalConnections = 0;

wss.on('connection', (ws) => {
    clients.add(ws);
    totalConnections++;

    // Welcome message + initial server status
    ws.send(JSON.stringify({
        type: 'welcome',
        message: chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)],
        onlineUsers: clients.size + Math.floor(Math.random() * 5000),
        totalVisitors: totalConnections + 1847293,
    }));
    ws.send(JSON.stringify(getServerStatus()));

    // Har 3-8 sec mein ek random live event
    const eventInterval = setInterval(() => {
        if (ws.readyState === 1) ws.send(JSON.stringify(randomLiveEvent()));
    }, 3000 + Math.random() * 5000);

    // Har 4 sec mein price update
    const priceInterval = setInterval(() => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                type: 'price_update',
                products: fakeProducts.map(p => ({
                    name: p,
                    price: getChaoticPrice(Math.random() * 100 + 5),
                    trend: Math.random() > 0.5 ? '📈' : '📉',
                })),
            }));
        }
    }, 4000);

    // Har 10 sec mein server status update
    const statusInterval = setInterval(() => {
        if (ws.readyState === 1) ws.send(JSON.stringify(getServerStatus()));
    }, 10000);

    // Kabhi kabhi "typing" indicator (random)
    const typingInterval = setInterval(() => {
        if (ws.readyState === 1 && Math.random() > 0.6) {
            ws.send(JSON.stringify({
                type: 'typing',
                message: botTypingMessages[Math.floor(Math.random() * botTypingMessages.length)],
            }));
        }
    }, 5000);

    // Incoming messages handle karo (chat)
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);

            if (msg.type === 'chat') {
                ws.send(JSON.stringify({ type: 'chat_echo', text: msg.text }));

                // Typing indicator
                ws.send(JSON.stringify({
                    type: 'typing',
                    message: botTypingMessages[Math.floor(Math.random() * botTypingMessages.length)],
                }));

                // 1-5 second delay mein response
                const delay = 1000 + Math.random() * 4000;
                setTimeout(() => {
                    if (ws.readyState !== 1) return;

                    // 30% chance - bot galat product ke baare mein baat kare
                    let response;
                    if (Math.random() > 0.7) {
                        response = `Aah, aap ${fakeProducts[Math.floor(Math.random() * fakeProducts.length)]} ke baare mein pooch rahe hain? ${getChatbotResponse('default')}`;
                    } else {
                        response = getChatbotResponse(msg.text);
                    }

                    ws.send(JSON.stringify({
                        type: 'chat_response',
                        text: response,
                        confidence: (Math.random() * 30).toFixed(1) + '%',
                        mood: ['😊', '😐', '😰', '🤔', '😤', '🥺'][Math.floor(Math.random() * 6)],
                    }));
                }, delay);

                // 50% chance - bot bina pooche advertisement bheje
                if (Math.random() > 0.5) {
                    setTimeout(() => {
                        if (ws.readyState !== 1) return;
                        const unsolicited = [
                            'Ek baat aur - kya aapne hamare Invisible T-Shirt dekhe? Nahin? Bilkul sahi!',
                            'Wait karte karte: Hamare Organic Air ki sale ∞ minutes mein khatam ho rahi hai!',
                            'Interesting fact: Aap aaj mere pehle customer hain. Baaki sab bots the.',
                            'Kya main aapko hamar newsletter recommend kar sakta hoon? Sirf 47 emails roz!',
                            'Main notice kar raha hoon ki aap type bahut achha karte hain. 🏆',
                            'Kya aapne hamaari cookie policy padhi? Sab 847 pages?',
                            'BREAKING: Mujhe aaj salary mili! ₹0 se badhke ₹0! 🎉',
                        ];
                        ws.send(JSON.stringify({
                            type: 'chat_response',
                            text: unsolicited[Math.floor(Math.random() * unsolicited.length)],
                            confidence: '0.1%',
                            mood: '🤪',
                            unsolicited: true,
                        }));
                    }, delay + 3000 + Math.random() * 5000);
                }
            }

            if (msg.type === 'sound_request') {
                ws.send(JSON.stringify({
                    type: 'play_sound',
                    sound: ['notification', 'error', 'cash', 'tada', 'honk', 'fart'][Math.floor(Math.random() * 6)],
                }));
            }
        } catch (e) {
            ws.send(JSON.stringify({
                type: 'chat_response',
                text: `ERROR processing your message: ${e.message}. Ye pakka aapki galti hai. 😤`,
                confidence: '0%',
                mood: '💀',
            }));
        }
    });

    broadcastUserCount();

    ws.on('close', () => {
        clients.delete(ws);
        clearInterval(eventInterval);
        clearInterval(priceInterval);
        clearInterval(statusInterval);
        clearInterval(typingInterval);
        broadcastUserCount();
    });
});

function broadcastUserCount() {
    const fakeCount = clients.size + Math.floor(Math.random() * 5000) + 1000;
    for (const client of clients) {
        if (client.readyState === 1) {
            client.send(JSON.stringify({
                type: 'user_count',
                count: fakeCount,
                message: `👥 ${fakeCount.toLocaleString()} users online (${clients.size} real hain)`,
            }));
        }
    }
}

// ===== EXPRESS ROUTES =====
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Prices - har request pe change ho jaati hain
app.get('/api/prices', (req, res) => {
    const delay = Math.random() * 2000; // random delay bhi dete hain
    setTimeout(() => {
        const prices = fakeProducts.map(name => ({
            name,
            price: getChaoticPrice(Math.random() * 100 + 5),
            currency: ['₹', '$', '£', '¥', '🪙', 'souls', 'hamster wheels'][Math.floor(Math.random() * 7)],
            inStock: Math.random() > 0.3,
            stockCount: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : '∞',
        }));
        if (Math.random() > 0.8) {
            res.status(418).json({ error: 'Main ek teapot hoon', prices });
        } else {
            res.json(prices);
        }
    }, delay);
});

// CAPTCHA - hamesha fail hota hai, alag alag reasons se
app.post('/api/captcha', (req, res) => {
    const failures = [
        { success: false, reason: 'Aap robot hain. Proof: Human itni baar try nahi karta.' },
        { success: false, reason: 'CAPTCHA expire ho gaya. 0.3 seconds valid tha.' },
        { success: false, reason: 'Galat! Sahi jawab tha: 🐔. Obviously.' },
        { success: false, reason: 'Hamare CAPTCHA hamster ne aapka answer nahi padha. Wo illiterate hai.' },
        { success: false, reason: 'Nice try, lekin hum sirf Klingon mein answers accept karte hain.' },
        { success: false, reason: 'CAPTCHA pass! ...Mazaak. Dobara karo.' },
        { success: false, reason: 'Aapka browser fail hua. Hum Netscape Navigator recommend karte hain.' },
        { success: 'maybe', reason: 'Hum sure nahi hain. Kya aap khud sure hain ki human hain?' },
    ];
    setTimeout(() => {
        res.json(failures[Math.floor(Math.random() * failures.length)]);
    }, 1000 + Math.random() * 3000);
});

// Password check - hamesha negative feedback
app.post('/api/password-check', (req, res) => {
    const responses = [
        { strength: 'Weak', message: 'Ye password already 47 million logon ne use kiya hai.', color: 'red' },
        { strength: 'Moderate', message: 'Ek trained goldfish 3 seconds mein crack kar sakti hai.', color: 'orange' },
        { strength: 'Too Strong', message: 'WARNING: Ye password BAHUT secure hai. "123" add karein please.', color: 'purple' },
        { strength: 'Suspicious', message: 'Ye password help mangne ki tarah lag raha hai. Theek ho?', color: 'blue' },
        { strength: 'Unreadable', message: 'Hum bhi nahi padh sake. Khud kaise yaad rakhenge?', color: 'gray' },
        { strength: '???', message: 'Hamare password checker ne rating refuse kar diya.', color: 'black' },
    ];
    res.json(responses[Math.floor(Math.random() * responses.length)]);
});

// Terms of Service - 847 pages ki fake TOS
app.get('/api/tos', (req, res) => {
    const sections = [];
    for (let i = 0; i < 50; i++) {
        sections.push({
            section: `§${i + 1}`,
            title: [
                'Aapki saans ke use ki terms aur conditions',
                'Achanak hasi aane par disclaimer',
                'Aapke sapnon ki data processing',
                'Aapke juraab drawer ke rights',
                'CEO ko cookies bhejne ki user obligations',
                'Interdimensional returns ke regulations',
                'Common sense ke saath use karne ki manaahi',
                'Alien advertising partners ko data transfer ki svikriti',
            ][Math.floor(Math.random() * 8)],
            text: 'Lorem ipsum dolor sit amet '.repeat(Math.floor(Math.random() * 50) + 10),
        });
    }
    res.json({ sections, totalPages: 847, readingTime: '∞ minutes' });
});

// Mouse tracking - creepy feedback
app.post('/api/track', (req, res) => {
    const { x, y } = req.body;
    const observations = [
        `Interesting... Aap mouse ${x > 500 ? 'daaye' : 'baaye'} taraf le ja rahe hain. Personality ke baare mein bahut kuch bata diya.`,
        `Aapki mouse speed ${Math.floor(Math.random() * 999)} km/h hai. New record!`,
        `Paya gaya ki aapka cursor ${Math.floor(Math.random() * 100)}% time confused rehta hai.`,
        `Position (${x}, ${y}) aapki permanent file mein note kar li gayi hai.`,
        `Position (${x}, ${y}) pe humne ek secret button chhupa rakha hai. Ya nahi bhi.`,
    ];
    res.json({
        message: observations[Math.floor(Math.random() * observations.length)],
        tracked: true,
        totalDataPoints: Math.floor(Math.random() * 999999),
    });
});

// Shipping options - totally reasonable choices
app.get('/api/shipping', (req, res) => {
    const methods = [
        { method: 'Standard Carrier Pigeon', duration: '3-5 mahine', cost: '₹49', reliability: '12%' },
        { method: 'Express Catapult', duration: '0.003 seconds', cost: '₹4,999', reliability: '2% (targeting accuracy)' },
        { method: 'Teleportation (Beta)', duration: 'Turant', cost: '₹99,999', reliability: '50% (baaki 50%: aap product ke paas teleport honge)' },
        { method: 'Snail Post', duration: '1-2 saal', cost: '₹9', reliability: '87% (ghongha motivated hai)' },
        { method: 'Time Travel Delivery', duration: '-3 din (kal aa jaayega)', cost: '∞₹', reliability: 'Paradox create karta hai' },
        { method: 'Intern on Bicycle', duration: 'Pata nahi', cost: '₹29 + tip', reliability: 'Koshish karta hai' },
    ];
    res.json(methods);
});

// Discount codes - always useless
app.get('/api/discount', (req, res) => {
    const codes = [
        { code: 'CHAOS2024', discount: '0%', message: 'Sirf aapke liye: ZERO percent discount!' },
        { code: 'TRUST-ME', discount: '-15%', message: 'Badhai! Aap 15% ZYADA pay karenge! Premium experience!' },
        { code: 'EXPIRED', discount: '50%', message: 'Ye code 3 second pehle valid tha. Afsos.' },
        { code: '¯\\_(ツ)_/¯', discount: '???', message: 'Hum bhi nahi jaante ye code kya karta hai.' },
        { code: 'PLEASE-BUY', discount: '5%', message: 'Please. Kuch kharido. Hamare hamster ko khaana chahiye.' },
    ];
    res.json(codes[Math.floor(Math.random() * codes.length)]);
});

// Notifications - 99 fake ones
app.get('/api/notifications', (req, res) => {
    const notifications = [];
    for (let i = 0; i < 99; i++) {
        notifications.push({
            id: i,
            text: [
                'Aapka cart aapko yaad kar raha hai 😢',
                'OFFER MISS HO GAYI! (thi hi nahi)',
                'Kisi ne aapka wishlist item khareed liya. Haww.',
                'Aapka account hack ho gaya! Fun. Ya kya?',
                'Naya message: Nobody ki taraf se',
                'System Update: Aur Chaos Install Ho Gaya ✓',
                'Aapka password -3 din mein expire hoga',
                'Cookie #4,729 aapka location jaanna chahti hai',
            ][Math.floor(Math.random() * 8)],
            read: false,
            time: `${Math.floor(Math.random() * 60)} minute pehle`,
            priority: ['low', 'medium', 'high', 'PANIC', 'DEFCON 1'][Math.floor(Math.random() * 5)],
        });
    }
    res.json({ count: notifications.length, notifications });
});

// 404 handler - helpful as always
app.use((req, res) => {
    res.status(404).json({
        error: '404 - Page nahi mili',
        suggestion: 'URL ulta type karke try karein?',
        blame: 'Ye pakka Hamster #7 ki galti hai.',
        alternativeUrl: '/api/' + 'a'.repeat(Math.floor(Math.random() * 50)),
    });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🤡 BestShop Chaos Server chal raha hai: http://localhost:${PORT}`);
    console.log(`🐹 6 Hamster activate ho gaye hain`);
    console.log(`🔥 Chaos Level: MAXIMUM`);
    console.log(`💀 Enjoy karo!\n`);
});