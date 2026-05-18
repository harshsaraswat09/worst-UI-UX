/* ===================================================
   cookie.js - Cookie Banner (Swapped Buttons)
   
   YE FILE KYA KARTI HAI:
   - Cookie banner show karta hai loading ke baad
   - Buttons intentionally swapped hain:
     * Bada green "ACCEPT ALL" button → actually chaos start karta hai (reject)
     * Tiny invisible "only necessary" button → alert deta hai
   - Loading screen progress bar bhi yahan handle hota hai
   =================================================== */

// Loading screen ke messages - randomly dikhte hain
const loadingStatuses = [
    'Quantum processors initialize ho rahe hain...',
    'Unnecessary animations load ho rahi hain...',
    'Zindagi ka matlab calculate ho raha hai...',
    'Hawa decompress ho rahi hai...',
    'Chaos engine calibrate ho rahi hai...',
    '47,000 tracking pixels load ho rahe hain...',
    'Comic Sans install ho raha hai...',
    'Aankhon ke dard ki taiyari ho rahi hai...',
    'Unnecessary popups ban rahe hain...',
    'Almost ready...',
    'Bas ek second aur...',
    'Thoda aur ruko bhai...',
    'Hamster servers se connect ho raha hai...',
    'Server hamsters ko khana de rahe hain...',
];

// ===== LOADING SCREEN =====
// Progress bar intentionally unreliable hai:
// - Kabhi kabhi backward bhi jaati hai
// - 95% pe artificially stuck ho jaati hai
let loadProgress = 0;

const loadingInterval = setInterval(() => {
    if (Math.random() > 0.3) {
        loadProgress += Math.random() * 8;     // Aage badho
    } else {
        loadProgress -= Math.random() * 15;    // Peeche jao (frustrating!)
        if (loadProgress < 0) loadProgress = 0;
    }

    // 95-98% pe artificially atakna
    if (loadProgress >= 95 && loadProgress < 100) {
        loadProgress = 95 + Math.random() * 3;
    }

    if (loadProgress >= 100) {
        loadProgress = 100;
        document.getElementById('loading-bar').style.width = '100%';
        document.getElementById('loading-percent').textContent = '100%';
        document.getElementById('loading-status').textContent = 'Ready! Maza aayega... ya nahi bhi.';

        // 1 second baad loading hatao, cookie banner dikhao
        setTimeout(() => {
            document.getElementById('loading-overlay').style.display = 'none';
            document.getElementById('cookie-overlay').style.display = 'flex';
        }, 1000);

        clearInterval(loadingInterval);
        return;
    }

    document.getElementById('loading-bar').style.width = loadProgress + '%';
    document.getElementById('loading-percent').textContent = Math.floor(loadProgress) + '%';
    document.getElementById('loading-status').textContent =
        loadingStatuses[Math.floor(Math.random() * loadingStatuses.length)];
}, 400);

// ===== COOKIE BANNER BUTTONS =====
// NOTE: Buttons SWAPPED hain - ye intentional UX crime hai

// Bada green button - dikhne mein "Accept All" lagta hai
// Lekin actually chaos start karta hai (matlab user ne "reject" kiya)
document.getElementById('cookie-reject-btn').addEventListener('click', () => {
    document.getElementById('cookie-overlay').style.display = 'none';
    startChaos(); // main.js mein defined hai
});

// Tiny invisible button - dikhne mein "Only Necessary" lagta hai
// Lekin actually ek impossible math question poochta hai
document.getElementById('cookie-accept-btn').addEventListener('click', () => {
    alert(
        'Sirf necessary cookies choose karne ke liye pehle solve karein:\n\n' +
        'Pi ki 47vi decimal digit ko CEO ke balon ki sankhya se multiply karein?\n\n' +
        '(Hint: Ye ek prime number hai)'
    );
});