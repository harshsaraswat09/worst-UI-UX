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
    'Bas ek second...',
    'Thoda aur ruko...',
    'Hamster servers se connect ho raha hai...',
    'Server hamsters ko khana de rahe hain...',
];

// ===== LOADING SCREEN (REMOVED) =====
document.getElementById('loading-overlay').style.display = 'none';
document.getElementById('cookie-overlay').style.display = 'flex';

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