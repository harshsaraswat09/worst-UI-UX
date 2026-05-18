# 🛒 BestShop India — Bad UI Challenge

> **The only online store you never want to visit again.**

A deliberately disastrously designed web application that celebrates every conceivable UX crime. Built as a humorous showcase for how you should **not** design anything, ever.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![UX Crimes](https://img.shields.io/badge/UX-Crimes-red?style=for-the-badge)

---

## 🤡 Features

### Frontend Chaos

- **Cookie Banner from Hell** — Swapped buttons, "Soul Cookies (Required)", tiny reject button hidden in a corner
- **Invisible Navigation** — Yellow text on yellow background, links rotate 180° on hover
- **Products That Run Away** — Buy buttons flee from the mouse cursor, products shrink on hover
- **Registration Form** — Password confirmation must be *different*, birth years in random order, CAPTCHA with blur & Zalgo text
- **Newsletter Volume** — 10×10 grid that activates random cells when you try to unsubscribe
- **Terms & Conditions Checkbox** — Runs away from the mouse every time you try to click it
- **Emoji Snowfall** — Raining emojis, inverted scrollbar, rotating logos, Comic Sans everywhere
- **Shopping Cart Pre-filled** — "Remove" button doubles the quantity instead of removing
- **Credit Card Live Stream** — "Will be streamed to 8,472 viewers 👀"
- **Mirror Signature** — Draws your signature inverted in rainbow colors

---

### ⚙️ Server Power (Node.js)

- **Live Ticker via WebSocket** — Fake purchase notifications like *"Ramesh Bhaiya from Jhansi bought wireless cables!"*
- **BestBot 3000 Chatbot** — Always replies incorrectly, sends unsolicited ads, shows *"Confidence: 4.7%"*
- **Server Status Dashboard** — Live monitoring of 6 server hamsters *(Herbert: "Hat burnout")*
- **Mouse Tracking** — Creepy feedback: *"Position was noted in your permanent file"*
- **Password Checker** — Always negative: *"Too strong! Please add 123"*
- **CAPTCHA API** — Always fails: *"The correct answer was: chicken. Apparently."*
- **Shipping Options** — Carrier pigeon, Express catapult, Time travel delivery
- **Sound Effects** — Honk, Fart, Cash Register via Web Audio API 🔊

---

### 🥚 Easter Eggs

- **Konami Code** `↑ ↑ ↓ ↓ ← → ← → B A` — Activates full rave mode 🎉
- **Dark Mode** — Inverts the already chaotic site
- **Exit Intent Popup** — Triggers when your mouse leaves the browser
- **Tab Title Changes Randomly** — *"Your shopping cart is crying..."*, *"WARNING: Tab will destroy itself"*

---

## 🚀 Setup

```bash
# 1. Clone the repo
git clone https://github.com/harshsaraswat09/worst-UI-UX.git
cd worst-UI-UX

# 2. Install dependencies
npm install

# 3. Start the server
node server.js
```

Then open your browser and go to:
```
http://localhost:3000
```

---

## 🌐 Deploy (Render.com — Free, WebSocket Supported)

1. Go to [render.com](https://render.com) and login with GitHub
2. Click **New + → Web Service**
3. Connect the `worst-UI-UX` repository
4. Fill in the settings:

| Field | Value |
|---|---|
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free ✅ |

5. Click **Create Web Service** — done! 🎉

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/prices` | `GET` | Random prices (change with every request) |
| `/api/captcha` | `POST` | CAPTCHA verification (always fails) |
| `/api/password-check` | `POST` | Password rating (always negative) |
| `/api/shipping` | `GET` | Shipping options (carrier pigeon to time travel) |
| `/api/discount` | `GET` | Random discount code (0% to -15%) |
| `/api/track` | `POST` | Mouse tracking with creepy feedback |
| `/api/notifications` | `GET` | 99 unread fake notifications |
| `/api/tos` | `GET` | 847-page fake terms and conditions |

---

## ⚠️ Disclaimer

This website was **intentionally designed to be terrible.**
Please don't copy any of this into a real project. No UX designer was physically injured during creation.

> Designed with ~~love~~ chaos by a team that treats UX guidelines as a personal challenge.

