/* ===================================================
   sounds.js - Web Audio API Sound Effects
   
   YE FILE KYA KARTI HAI:
   - Web Audio API use karke synth sounds banati hai
   - Koi external audio files nahi chahiye
   - soundEnabled = false by default (user toggle kare)
   
   FUNCTIONS:
   - initAudio()     → AudioContext create karta hai (first user interaction pe)
   - playSound(type) → type ke hisaab se sound bajata hai
   - toggleSound()   → sound on/off toggle karta hai
   
   SOUND TYPES: notification, error, cash, tada, honk, fart
   =================================================== */

let audioCtx = null;
let soundEnabled = true; // Default ON

// Pehle user interaction (click/tap) pe automatically audio context banao
// Browser require karta hai ki AudioContext kisi user gesture ke baad hi create ho
function initAudio() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    // Resume karo agar suspended ho (mobile browsers mein hota hai)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Pehle click pe hi audio initialize ho jaayega (chahe koi bhi element click ho)
document.addEventListener('click', function initOnFirstClick() {
    initAudio();
    // Ek baar ke baad yeh listener hata do
    document.removeEventListener('click', initOnFirstClick);
}, { once: true });

// Main sound player - oscillator + gain node se synth sound
function playSound(type) {
    if (!soundEnabled || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.15;

    switch (type) {
        case 'notification':
            // Simple high beep
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
            break;

        case 'error':
            // Low harsh buzz
            osc.frequency.value = 200;
            osc.type = 'sawtooth';
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start(); osc.stop(audioCtx.currentTime + 0.5);
            break;

        case 'cash':
            // Two-tone cash register ding
            osc.frequency.value = 1200;
            osc.type = 'triangle';
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
            setTimeout(() => {
                if (!audioCtx) return;
                const o2 = audioCtx.createOscillator();
                const g2 = audioCtx.createGain();
                o2.connect(g2); g2.connect(audioCtx.destination);
                o2.frequency.value = 1600; o2.type = 'triangle'; g2.gain.value = 0.1;
                g2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                o2.start(); o2.stop(audioCtx.currentTime + 0.2);
            }, 150);
            break;

        case 'tada':
            // 3-note ascending fanfare
            [523, 659, 784].forEach((freq, i) => {
                setTimeout(() => {
                    if (!audioCtx) return;
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g); g.connect(audioCtx.destination);
                    o.frequency.value = freq; o.type = 'square'; g.gain.value = 0.08;
                    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                    o.start(); o.stop(audioCtx.currentTime + 0.3);
                }, i * 150);
            });
            break;

        case 'honk':
            // Low car horn
            osc.frequency.value = 150;
            osc.type = 'sawtooth';
            gain.gain.value = 0.2;
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            osc.start(); osc.stop(audioCtx.currentTime + 0.8);
            break;

        case 'fart':
            // Descending low rumble
            osc.frequency.value = 80;
            osc.type = 'sawtooth';
            gain.gain.value = 0.15;
            osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
            osc.start(); osc.stop(audioCtx.currentTime + 0.6);
            break;

        default:
            // Generic beep for anything else
            osc.frequency.value = 440; osc.type = 'sine';
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    }
}

// Sound toggle button - #sound-toggle se call hota hai
function toggleSound() {
    initAudio(); // Pehli baar click pe AudioContext create hoga
    soundEnabled = !soundEnabled;
    document.getElementById('sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) {
        playSound('tada');
        showToast('🔊 Sound on! Pachtaoge.', 'system');
    }
}