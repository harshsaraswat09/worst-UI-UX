/* ===================================================
   main.js - General Chaos Controller
   
   YE FILE KYA KARTI HAI:
   - Custom cursor (emoji, delayed movement)
   - Product cards generate karta hai
   - Reviews generate karta hai (horizontal scroll)
   - Emoji snow start karta hai
   - Random popups schedule karta hai
   - Newsletter countdown schedule karta hai
   - Visitor counter (fake, rapid changes)
   - Mouse tracking (/api/track)
   - Scroll progress (inverted)
   - Page jitter (random shake)
   - Evil tooltips (random mouse pe)
   - Exit-intent popup
   - Dark mode toggle
   - Notification badge
   - Floating ads (close pe move + grow)
   - Scroll hijacking (kabhi kabhi reverse scroll)
   - Tab title random changes
   - Konami code Easter egg (Rave mode)
   - Right-click blocked
   - Click particles
   - Toast notifications
   - startChaos() - cookie.js ke baad call hota hai
   =================================================== */

// ===== CUSTOM CURSOR =====
// Emoji cursor jo delayed movement karta hai + click pe change hota hai
const cursor = document.getElementById('custom-cursor');
const cursorEmojis = ['🍕', '🐛', '💀', '🤡', '🔥', '👁️', '🦆', '💩', '👻', '🌮'];
let cursorIdx = 0;

document.addEventListener('mousemove', (e) => {
    // 100ms delay + sinusoidal movement - cursor kabhi bhi seedha nahi chalta
    setTimeout(() => {
        cursor.style.left = (e.clientX + Math.sin(Date.now() / 200) * 20) + 'px';
        cursor.style.top  = (e.clientY + Math.cos(Date.now() / 200) * 20) + 'px';
    }, 100);

    // Mouse tracker panel update
    document.getElementById('track-pos').textContent = `${e.clientX}, ${e.clientY}`;
});

// Click pe cursor emoji change + scale animation
document.addEventListener('click', () => {
    cursorIdx = (cursorIdx + 1) % cursorEmojis.length;
    cursor.textContent = cursorEmojis[cursorIdx];
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    setTimeout(() => cursor.style.transform = 'translate(-50%, -50%) scale(1)', 200);
    playSound(['notification', 'cash', 'honk', 'fart'][Math.floor(Math.random() * 4)]);
});

// ===== MOUSE TRACKING API CALL =====
// Har mouse move pe nahi, sirf 10% probability pe /api/track call karta hai
let trackTimeout;
document.addEventListener('mousemove', (e) => {
    clearTimeout(trackTimeout);
    trackTimeout = setTimeout(() => {
        if (Math.random() > 0.9) { // Sirf 10% chance
            fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ x: e.clientX, y: e.clientY }),
            })
            .then(r => r.json())
            .then(data => {
                document.getElementById('track-msg').textContent = data.message;
            })
            .catch(() => {});
        }
    }, 500);
});

// ===== PRODUCTS =====
// 12 fake products generate karta hai randomly rotated cards ke saath
function generateProducts() {
    const products = [
        { name: 'Invisible T-Shirt',      price: '₹4,999', img: '👕', desc: 'Dikh nahi raha? Matlab sahi kaam kar raha hai!' },
        { name: 'Used Air (Organic)',      price: '₹2,999', img: '💨', desc: 'Ek vegan ne fresh exhale kiya' },
        { name: 'Trained Dust Bunny',     price: '₹14,999', img: '🐭', desc: 'Tricks karta hai! (Kabhi kabhi)' },
        { name: 'Wireless Cables',        price: '₹1,999', img: '🔌', desc: 'Finally! Cables bina cables ke!' },
        { name: 'Anti-Gravity Stone',     price: '₹99,999', img: '🪨', desc: 'Sirf upar girta hai. Guaranteed.*' },
        { name: 'Password Diary',         price: '₹1,299', img: '📖', desc: 'Saare passwords ek jagah!' },
        { name: 'Solar Flashlight',       price: '₹3,499', img: '🔦', desc: 'Sirf dhoop mein kaam karta hai' },
        { name: 'Waterproof Sponge',      price: '₹899',   img: '🧽', desc: 'Paani absorb nahi karta. Premium.' },
        { name: 'Single-Use Bottle',      price: '₹599',   img: '🍶', desc: 'Eco-friendly AND disposable!' },
        { name: 'Bluetooth Hammer',       price: '₹7,999', img: '🔨', desc: 'App se thoka karo. Future hai!' },
        { name: 'Lactose-Free Brick',     price: '₹2,499', img: '🧱', desc: 'Allergy walo ke liye. Vegan.' },
        { name: 'NFT of a Fart',          price: '₹4,99,999', img: '💎', desc: 'Limited edition. 1 of 10,00,000' },
    ];

    const grid = document.getElementById('products');
    products.forEach((p, i) => {
        const rotation = (Math.random() - 0.5) * 20; // Random tilt
        grid.innerHTML += `
            <div class="product-card" style="--rotation: ${rotation}deg">
                <div class="fake-badge">${['NAI!', 'HOT!', 'SALE!', 'WOW!', 'OMG!', 'VIRAL!'][i % 6]}</div>
                <div style="font-size:80px;filter:hue-rotate(${i * 60}deg);">${p.img}</div>
                <h3 style="font-size:18px;">${p.name}</h3>
                <p style="font-size:12px;color:#666;">${p.desc}</p>
                <div class="price">${p.price}</div>
                <div class="live-price" style="font-size:14px;color:red;">${p.price} 📈</div>
                <div class="real-price">Asli price: Aapki izzat</div>
                <button class="buy-btn" onclick="handleBuy('${p.name}')">Cart mein daalo</button>
                <div style="margin-top:8px;">
                    ${'⭐'.repeat(Math.floor(Math.random() * 3) + 3)}${'☆'.repeat(2)}
                    <span style="font-size:10px;color:#999;">(${Math.floor(Math.random() * 50000)} reviews)</span>
                </div>
            </div>
        `;
    });
}

// Buy button click pe - item kabhi cart mein nahi jaata, funny message aata hai
function handleBuy(name) {
    const responses = [
        `${name} kisi aur ke cart mein chala gaya. Aapke nahi.`,
        `${name} sirf parallel universe edition mein available hai.`,
        `${name} ne AAPKO apne cart mein add kar liya.`,
        `${name} unlock karne ke liye pehle 5 aur cheezein khariden!`,
        `ERROR 418: Main ek teapot hoon aur ${name} process nahi kar sakta.`,
    ];
    alert(responses[Math.floor(Math.random() * responses.length)]);
    playSound('error');
}

// ===== REVIEWS =====
// Horizontally scrollable, slightly rotated review cards
function generateReviews() {
    const reviews = [
        { name: 'Ramesh M.',    stars: 5, text: 'Invisible T-Shirt order kiya. Box khali tha. 5 star, description ke hisaab se sahi!' },
        { name: 'Sunita K.',    stars: 1, text: 'Website ne mere computer ko rula diya. Literally.' },
        { name: 'Pappu W.',     stars: 5, text: 'Is website ne meri zindagi badal di. Ab main akela rehta hoon.' },
        { name: 'Sabine L.',    stars: 3, text: 'Bluetooth Hammer: Har thok ke liye app kholna padta hai aur 30 sec ad dekhna.' },
        { name: 'Brijesh D.',   stars: 5, text: 'Mera credit card rota hai, lekin normal hai na?' },
        { name: 'Guddi S.',     stars: 5, text: 'NFT of a Fart kharida. Worth it tha? Nahi. Lekin ab mere paas hai.' },
        { name: 'Bilkul Real Insaan', stars: 5, text: 'Bahut achha shop hai. Main asli insaan hoon bot nahi. Beep boo- matlab: Pranam!' },
    ];

    const section = document.getElementById('reviews-section');
    reviews.forEach(r => {
        const rot = (Math.random() - 0.5) * 10;
        section.innerHTML += `
            <div class="review-card" style="--rot: ${rot}deg">
                <div class="stars">${'⭐'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
                <p style="font-style:italic;margin:10px 0;">"${r.text}"</p>
                <p style="font-weight:bold;font-size:14px;">- ${r.name}</p>
                <p style="font-size:10px;color:#999;">Verified purchase (nahi actually)</p>
            </div>
        `;
    });
}

// ===== EMOJI SNOWFALL =====
// Emojis continuously top se fall karte hain
function startSnow() {
    const container = document.getElementById('snow-container');
    const emojis = ['🍪', '💸', '📧', '🔥', '⭐', '🛒', '💳', '🤡', '👁️', '🍕'];
    setInterval(() => {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        flake.style.left              = Math.random() * 100 + 'vw';
        flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        flake.style.fontSize          = (Math.random() * 20 + 12) + 'px';
        container.appendChild(flake);
        setTimeout(() => flake.remove(), 5000); // 5 sec baad hatao
    }, 300);
}

// ===== POPUPS =====
// Random positions pe appear hote hain, buttons misleading hain
const popupMessages = [
    { title: '🎉 JEET GAYE!',    text: 'Aap 10,00,00,000 wein visitor hain!' },
    { title: '⚠️ WARNING',       text: 'Aapke computer mein virus hai! Anti-Virus T-Shirt khariden sirf ₹29,999 mein!' },
    { title: '💬 MESSAGE',       text: 'Aapka cart aapko yaad kar raha hai. Roya bhi.' },
    { title: '🔔 REMINDER',      text: 'Aapke cart mein hawa bachi hai! Demand bahut zyada hai!' },
    { title: '📢 BREAKING',      text: 'Koi insaan is website pe kuch kharidne mein kamiyab! Scientists shocked!' },
    { title: '🤔 SURVEY',       text: 'Dard se takleef tak scale pe: Is website ko rate karein?' },
];

function showPopup() {
    const msg = popupMessages[Math.floor(Math.random() * popupMessages.length)];
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.top  = Math.random() * 60 + 10 + '%';
    popup.style.left = Math.random() * 50 + 10 + '%';

    // Close button kabhi right pe hota hai kabhi screen ke bahar
    const closePos = Math.random() > 0.5 ? 'right: 5px;' : 'right: -30px;';

    popup.innerHTML = `
        <button class="btn-close" style="${closePos}" onclick="this.parentElement.remove()">✕</button>
        <h2>${msg.title}</h2>
        <p>${msg.text}</p>
        <button onclick="alert('Galat button! 😈')" style="background:green;color:white;border:none;">OK</button>
        <button onclick="showPopup(); this.parentElement.remove();" style="background:red;color:white;border:none;">Band karo</button>
    `;
    document.body.appendChild(popup);
    playSound('notification');

    // 50% chance pe 10 seconds baad khud chala jaata hai
    if (Math.random() > 0.5) setTimeout(() => popup.remove(), 10000);
}

function schedulePopups() {
    setTimeout(showPopup, 3000);                              // 3 sec baad pehla popup
    setInterval(() => { if (Math.random() > 0.4) showPopup(); }, 8000); // Phir har 8 sec
}

// ===== NEWSLETTER COUNTDOWN =====
// 25 sec baad ek countdown overlay aata hai
function scheduleCountdown() {
    setTimeout(() => {
        document.getElementById('countdown-overlay').style.display = 'flex';
        playSound('honk');
        let count = 10;
        const timer = setInterval(() => {
            count--;
            document.getElementById('countdown-timer').textContent = count;
            playSound('notification');
            if (count <= 0) {
                clearInterval(timer);
                document.getElementById('countdown-overlay').style.display = 'none';
                alert('🎉 Newsletter ke liye subscribe ho gaye!\n\n(Nahi actually. Ya ho gaye? 🤔)');
            }
        }, 1000);
    }, 25000);
}

function closeCountdown() {
    document.getElementById('countdown-overlay').style.display = 'none';
}

// ===== VISITOR COUNTER =====
// Rapidly change karta hai, kabhi kabhi thoda decrease bhi karta hai
function startVisitorCounter() {
    setInterval(() => {
        const el = document.getElementById('visitor-counter');
        const current = parseInt(el.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 1000) - 200;
        el.textContent = (current + change).toLocaleString();
    }, 100);
}

// ===== SCROLL PROGRESS (INVERTED) =====
// Normal progress bar neeche jaane pe barhti hai
// Yahan ULTA hai - upar jaao toh barhti hai
function setupScrollProgress() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = 100 - (scrollTop / docHeight * 100); // Inverted
        document.getElementById('scroll-progress').style.width = progress + '%';
    });
}

// ===== PAGE JITTER =====
// Randomly whole page shake karta hai
function startPageJitter() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            document.getElementById('main-content').classList.add('jitter');
            setTimeout(() => document.getElementById('main-content').classList.remove('jitter'), 2000);
        }
    }, 5000);
}

// ===== EVIL TOOLTIPS =====
// Mouse pe hover karo toh random sarcastic tooltip dikhta hai
function setupEvilTooltips() {
    const tooltips = [
        'Aap mouse bahut achha chalate hain! 10/10',
        'Scroll karte raho, better nahi hoga.',
        'Ye website ka ye part khaas useless hai.',
        'WARNING: Cursor abhi building se bahar jaane wala hai.',
    ];
    const tooltip = document.getElementById('evil-tooltip');
    let tooltipTimeout;

    document.addEventListener('mousemove', (e) => {
        clearTimeout(tooltipTimeout);
        tooltip.style.display = 'none';
        tooltipTimeout = setTimeout(() => {
            if (Math.random() > 0.85) { // 15% chance pe dikhao
                tooltip.textContent = tooltips[Math.floor(Math.random() * tooltips.length)];
                tooltip.style.display = 'block';
                tooltip.style.left = (e.clientX + 20) + 'px';
                tooltip.style.top  = (e.clientY - 60) + 'px';
                setTimeout(() => tooltip.style.display = 'none', 3000);
            }
        }, 1500);
    });
}

// ===== TOAST NOTIFICATIONS =====
// Multiple jagah se call hota hai - bottom se slide in/out karte hain
function showToast(text, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-type">${type || 'info'}</div>${text}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);

    // Max 5 toasts rakhte hain
    while (container.children.length > 5) container.firstChild.remove();
}

// ===== MISC FUNCTIONS =====

// Floating ad "close" pe move karta hai aur size barhta hai
function moveAd(adId) {
    const ad = document.getElementById(adId);
    ad.style.top    = Math.random() * 70 + 10 + '%';
    ad.style.left   = Math.random() * 60 + 10 + '%';
    ad.style.width  = (parseInt(ad.style.width) || 200) + 50 + 'px'; // Grows!
    playSound('honk');
}

// Notification badge click pe count badh jaata hai
let notifCount = 99;
function addNotifications() {
    notifCount += Math.floor(Math.random() * 50) + 10;
    document.getElementById('notif-count').textContent = notifCount + '+';
    playSound('error');
    showToast(`📬 ${notifCount} unread notifications! Zyaatar aapke cart ki taraf se hain.`, 'notification');
}

// Dark mode - already chaotic page aur worse ho jaati hai (CSS filter: invert)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    playSound('fart');
    showToast(
        document.body.classList.contains('dark-mode')
            ? '🌙 Dark Mode: Website better nahi hui, sirf alag tarah se buri hai.'
            : '☀️ Light Mode: Aankhon ka dard wapas!',
        'system'
    );
}

// Exit intent popup - mouse page se bahar jaaye toh
let exitShown = false;
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitShown) {
        exitShown = true;
        document.getElementById('exit-popup').style.display = 'flex';
        playSound('honk');
    }
});

function closeExitPopup() {
    document.getElementById('exit-popup').style.display = 'none';
    setTimeout(() => { exitShown = false; }, 10000); // 10 sec baad phir se enable
}

// ===== SCROLL HIJACKING =====
// Kabhi kabhi scroll ulta ho jaata hai
let scrollHijack = false;
setInterval(() => { scrollHijack = Math.random() > 0.8; }, 5000);
window.addEventListener('wheel', (e) => {
    if (scrollHijack) {
        window.scrollBy(0, -e.deltaY * 2); // Ulta aur double speed
        e.preventDefault();
    }
}, { passive: false });

// ===== TAB TITLE CHANGES =====
// Randomly shocking tab titles
setInterval(() => {
    if (Math.random() > 0.8) {
        document.title = [
            'BROWSER BAND MAT KARO!',
            'Aapka cart roo raha hai...',
            '(47) naye messages',
            '🔥🔥🔥 SALE 🔥🔥🔥',
            'WARNING: Tab khud ko delete kar lega',
            'BestShop aapko yaad kar raha hai!',
        ][Math.floor(Math.random() * 6)];
    }
}, 3000);

// ===== KONAMI CODE - RAVE MODE =====
// ↑↑↓↓←→←→BA = Rave mode toggle
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > 10) konamiCode.shift();
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.classList.toggle('konami-mode');
        playSound('tada');
        alert('🎮 KONAMI CODE! Rave Mode: ON 🕺💃\n\n(Products ab dance kar rahe hain)');
    }
});

// ===== RIGHT CLICK BLOCKED =====
// Inspect element se bachne ke liye (theatrical, not actual security)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    playSound('error');
    alert('Right click band hai! 🚫\n\nYe website military-grade 2-bit encryption se protected hai.');
});

// ===== CLICK PARTICLES =====
// Har click pe emojis explode hote hain
document.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.textContent = ['✨', '💫', '⭐', '🌟', '💥'][Math.floor(Math.random() * 5)];
        p.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            z-index: 99999;
            font-size: 20px;
            transition: all 1s ease-out;
        `;
        document.body.appendChild(p);
        setTimeout(() => {
            p.style.left    = e.clientX + (Math.random() - 0.5) * 200 + 'px';
            p.style.top     = e.clientY - Math.random() * 200 + 'px';
            p.style.opacity = '0';
        }, 10);
        setTimeout(() => p.remove(), 1100);
    }
});

// ===== startChaos() =====
// Cookie banner ke baad call hota hai - sab kuch initialize karta hai
function startChaos() {
    connectWebSocket();      // websocket.js
    generateProducts();      // Products grid
    generateReviews();       // Review cards
    generateBirthYears();    // form.js
    generateVolumeGrid();    // form.js
    startSnow();             // Emoji snowfall
    setupSignatureCanvas();  // form.js
    setupRunawayCheckbox();  // form.js
    startVisitorCounter();   // Fake counter
    schedulePopups();        // Random popups
    scheduleCountdown();     // Newsletter countdown
    setupScrollProgress();   // Inverted progress bar
    startPageJitter();       // Random page shake
    setupEvilTooltips();     // Sarcastic tooltips
    loadShipping();          // form.js - /api/shipping

    // Notifications fetch karo
    fetch('/api/notifications')
    .then(r => r.json())
    .then(data => {
        document.getElementById('notif-count').textContent = data.count + '+';
    })
    .catch(() => {});
}