/* ===================================================
   form.js - Registration Form + Cart + Payment Logic
   
   YE FILE KYA KARTI HAI:
   
   REGISTRATION FORM:
   - Password confirm must be DIFFERENT (reverse logic)
   - Email field hidden hai (password-style)
   - Birth years random order mein hain + fake options
   - Volume grid (10x10) for newsletter "volume"
   - CAPTCHA always fails, Zalgo text
   - Runaway checkbox - hover pe bhaag jaata hai
   - Submit button tiny aur dodge karta hai
   - Form submit pe: passwords same hain toh error
   
   CART:
   - "Remove" button actually quantity double karta hai
   - Preloaded items hain
   
   PAYMENT:
   - Credit card number type karte hi "broadcast" shuru
   - Shipping options /api/shipping se load hote hain
   - Signature canvas - mirror image mein rainbow colors mein
   - Payment button - always fails
   
   FAQ:
   - Answer text upside down hai
   - Click pe random dusra FAQ scroll ho jaata hai
   =================================================== */

// ===== PASSWORD STRENGTH CHECKER =====
// /api/password-check ko call karta hai - always bad news milti hai
let pwCheckTimeout;
function checkPassword(value) {
    clearTimeout(pwCheckTimeout);
    if (!value) {
        document.getElementById('password-strength').style.display = 'none';
        return;
    }
    pwCheckTimeout = setTimeout(() => {
        fetch('/api/password-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: value }),
        })
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('password-strength');
            el.style.display = 'block';
            el.style.background = data.color;
            el.style.color = 'white';
            el.innerHTML = `<strong>${data.strength}</strong>: ${data.message}`;
        })
        .catch(() => {});
    }, 300);
}

// ===== CAPTCHA =====
// /api/captcha → hamesha fail
function verifyCaptcha() {
    const result = document.getElementById('captcha-result');
    result.style.display = 'block';
    result.textContent = 'Check kar raha hai...';
    result.style.background = '#eee';
    result.style.color = 'black';

    fetch('/api/captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: document.getElementById('captcha-input').value }),
    })
    .then(r => r.json())
    .then(data => {
        result.style.background = data.success === false ? '#ffdddd' : '#ffffdd';
        result.style.color = 'black';
        result.textContent = `${data.success === false ? '❌' : '🤷'} ${data.reason}`;
        playSound('error');
    })
    .catch(() => {
        result.textContent = '❌ Server hamster ne CAPTCHA ka kaagaz kha liya.';
        result.style.background = '#ffdddd';
    });
}

// Naya CAPTCHA generate karta hai - Zalgo text with random chars
function refreshCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // Zalgo combining characters - text weird dikhata hai
    const zalgo = ['̷', '̸', '̵', '̶', '̴', '̢', '̛', '̈́', '̰', '̤'];
    let text = '';
    for (let i = 0; i < 6; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
        text += zalgo[Math.floor(Math.random() * zalgo.length)];
    }
    document.getElementById('captcha-text').textContent = text;
}

// ===== BIRTH YEARS =====
// 1900-2026 random shuffle + kuch fake options
function generateBirthYears() {
    const select = document.getElementById('birth-year');
    const years = [];
    for (let y = 1900; y <= 2026; y++) years.push(y);

    // Fisher-Yates shuffle - random order mein
    for (let i = years.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [years[i], years[j]] = [years[j], years[i]];
    }

    // Kuch extra options add karo
    years.push('Kal', 'Kal se pehle', 'Time traveller hoon', 'Amar hoon', '404 - Saal nahi mila');

    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y;
        select.appendChild(opt);
    });
}

// ===== VOLUME GRID =====
// 10x10 grid, click pe random cells highlight hoti hain + random "volume" dikhta hai
function generateVolumeGrid() {
    const grid = document.getElementById('volume-grid');
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'volume-cell';
        cell.textContent = i + 1;
        cell.addEventListener('click', () => {
            // Sab cells clear karo
            document.querySelectorAll('.volume-cell').forEach(c => c.classList.remove('active'));
            // Random cells activate karo
            const count = Math.floor(Math.random() * 20) + 1;
            for (let j = 0; j < count; j++) {
                grid.children[Math.floor(Math.random() * 100)].classList.add('active');
            }
            // Volume 200% tak bhi ja sakta hai
            document.getElementById('volume-display').textContent =
                Math.floor(Math.random() * 200) + '%';
            playSound('notification');
        });
        grid.appendChild(cell);
    }
}

// ===== RUNAWAY CHECKBOX =====
// Mouseover pe container ke andar random position pe jump karta hai
function setupRunawayCheckbox() {
    const label = document.getElementById('terms-label');
    label.addEventListener('mouseover', () => {
        const container = label.parentElement;
        const maxX = container.offsetWidth - label.offsetWidth - 20;
        const maxY = container.offsetHeight - label.offsetHeight;
        label.style.left = Math.max(0, Math.random() * maxX) + 'px';
        label.style.top  = Math.max(0, Math.random() * maxY) + 'px';
    });
}

// ===== SIGNATURE CANVAS =====
// Mirror image mein draw hota hai (x reversed, y reversed) + rainbow colors
function setupSignatureCanvas() {
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', () => { drawing = true; });
    canvas.addEventListener('mouseup',   () => { drawing = false; });

    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        // X aur Y dono reverse karo - mirror effect
        const x = canvas.width  - (e.clientX - rect.left)  * (canvas.width  / rect.width);
        const y = canvas.height - (e.clientY - rect.top)   * (canvas.height / rect.height);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random rainbow color
        ctx.fill();
    });
}

// ===== FORM SUBMIT =====
// Password same hai toh fail, less than 45 chars toh fail, otherwise "almost" success
function handleFormSubmit(event) {
    event.preventDefault();
    const password        = document.getElementById('reg-password').value;
    const confirm         = document.getElementById('reg-password-confirm').value;

    // Passwords SAME nahi hone chahiye (reverse logic)
    if (password === confirm) {
        alert('GALTI: Dono passwords match kar rahe hain! Alag alag password daalna hota hai!');
        playSound('error');
        return false;
    }

    if (password.length < 45) {
        alert(`Password mein sirf ${password.length} characters hain. Kam se kam 45 chahiye!`);
        playSound('error');
        return false;
    }

    playSound('tada');
    alert('🎉 Registration almost complete!\n\nPlease 4-6 hafte ka intezaar karein confirmation kabutar ka.');
    return false;
}

// ===== CART =====
// "Remove" button actually aur items add karta hai - JS ka best trick
function addMore(btn) {
    const row = btn.closest('tr');
    const slider = row.querySelector('input[type="range"]');
    slider.value = parseInt(slider.value) + Math.floor(Math.random() * 50) + 10; // Double+
    slider.dispatchEvent(new Event('input')); // Price update trigger karo
    playSound('cash');
    showToast('🛒 Item double ho gaya! "Hatane" ki koshish ke liye shukriya!', 'purchase');
}

// ===== PAYMENT =====
// Credit card type karte hi "broadcast" message dikhta hai
function broadcastCC(value) {
    const display = document.getElementById('cc-broadcast');
    if (value.length > 4) {
        display.innerHTML = `📡 LIVE: ${value} ab ${Math.floor(Math.random() * 10000)} logon ko dikh raha hai... <span style="color:green;">● LIVE</span>`;
        playSound('notification');
    }
}

// Payment always fail hoti hai
function handlePayment() {
    const messages = [
        'Payment fail! Reason: Aapka paisa hamare standard ke layak nahi.',
        'Hamar payment system ek hamster hai aur wo break pe hai.',
        'Aapki payment ek random stranger ko chali gayi. Oops!',
        'SUCCESS! Ruko... nahi. Phir nahi.',
    ];
    alert(messages[Math.floor(Math.random() * messages.length)]);
    playSound('error');
}

// ===== SHIPPING OPTIONS =====
// /api/shipping se load hote hain
function loadShipping() {
    fetch('/api/shipping')
    .then(r => r.json())
    .then(methods => {
        const container = document.getElementById('shipping-options');
        container.innerHTML = '<h3 style="text-align:center;margin-bottom:15px;">📦 Delivery method chunein:</h3>';
        methods.forEach(m => {
            container.innerHTML += `
                <div class="shipping-option" onclick="selectShipping(this)">
                    <div>
                        <strong>${m.method}</strong><br>
                        <span style="font-size:12px;color:#666;">Duration: ${m.duration}</span><br>
                        <span style="font-size:11px;color:#999;">Reliability: ${m.reliability}</span>
                    </div>
                    <div style="font-size:20px;font-weight:bold;color:red;">${m.cost}</div>
                </div>
            `;
        });
    })
    .catch(() => {});
}

function selectShipping(el) {
    document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    playSound('cash');
    showToast('📦 Delivery method select ho gayi! (Shayad ignore kar dein hum)', 'info');
}

// ===== DISCOUNT CODE =====
// /api/discount se milta hai - always 0% ya negative
function getDiscount() {
    fetch('/api/discount')
    .then(r => r.json())
    .then(data => {
        document.getElementById('discount-display').innerHTML = `
            <div class="discount-code">${data.code}</div>
            <p style="font-size:24px;font-weight:bold;">Discount: ${data.discount}</p>
            <p style="font-size:16px;">${data.message}</p>
        `;
        playSound('tada');
        showToast(`🎫 Naya discount code: ${data.code} (${data.discount})`, 'promo');
    })
    .catch(() => {});
}

// ===== FAQ =====
// Answer upside down hai, click pe random dusra FAQ bhi scroll ho jaata hai
function toggleFaq(el) {
    const answer = el.nextElementSibling;
    answer.classList.toggle('show');

    // 50% chance pe ek random dusra FAQ bhi scroll karo - confusing!
    if (Math.random() > 0.5) {
        const allFaqs = document.querySelectorAll('.faq-question');
        allFaqs[Math.floor(Math.random() * allFaqs.length)].scrollIntoView({ behavior: 'smooth' });
    }
}