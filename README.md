# 🎤 PubSpeak — AI Public Speaking Simulator

> An interactive, AI-powered public speaking training platform that simulates real-world speaking scenarios with live audience reactions, pressure challenges, and intelligent performance evaluation.

---

## ✨ Features

### 🗣️ Practice Modes

| Mode | Description |
|------|-------------|
| **Standard Practice** | Conversational AI role-play across various speaking scenarios (job interviews, presentations, debates, etc.) |
| **AI Audience Mode** | Present to a simulated audience with configurable personalities (Supportive, Neutral, Curious, Critical, Interview Panel) |
| **Pressure Mode** | 5 progressive pressure levels with time-limited rounds, unexpected challenge questions, and a 20-second rapid-fire finale |

### 📊 Performance Evaluation

After each session, the AI evaluator scores your performance across scenario-specific metrics:

- **Standard**: Clarity, Structure, Relevance, Vocabulary, Pace, Filler Words, Confidence
- **Audience Mode**: Clarity, Structure, Engagement, Relevance, Conciseness, Handling Q&A
- **Pressure Mode**: Structure, Relevance, Conciseness, Handling Unexpected, Speaking Consistency

Each evaluation includes **strengths**, **actionable improvements**, a **session summary**, and a **next practice recommendation**.

### 🔊 AI Voice (TTS)

Powered by **ElevenLabs**, the AI partner speaks its responses aloud — creating a fully immersive, realistic conversation experience.

### 🔐 Security-First Architecture

- All AI API keys live **only on the server** — never exposed to the browser
- Server-side input validation and payload size limits (100 KB cap)
- Scores are computed strictly server-side; client scores are never trusted
- Automatic retry logic on AI API failures with a contextual fallback engine

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Vanilla CSS |
| **Backend** | Node.js, Express |
| **AI Engine** | Google Gemini 1.5 Flash (`gemini-1.5-flash`) |
| **Text-to-Speech** | ElevenLabs (`eleven_turbo_v2`) |
| **Auth & Storage** | Firebase (Auth + Firestore) |
| **Icons** | Lucide React |
| **Dev Tooling** | Concurrently, dotenv, CORS |

---

## 📁 Project Structure

```
pubspeak/
├── server/
│   ├── index.js          # Express API server (AI chat, TTS proxy, evaluation)
│   └── prompts.js        # Centralized server-side AI prompt builders
├── src/
│   ├── components/
│   │   ├── audience/     # AI Audience mode setup UI
│   │   ├── dashboard/    # Home dashboard view
│   │   ├── layout/       # Shell/layout wrapper
│   │   ├── profile/      # Progress & profile view
│   │   ├── results/      # Post-session results & scores
│   │   ├── room/         # Live practice room
│   │   ├── scenarios/    # Scenario selection UI
│   │   ├── setup/        # Practice session setup
│   │   ├── simulator/    # Core simulator logic
│   │   ├── common/       # Shared UI components
│   │   └── feedback/     # Feedback components
│   ├── context/          # React Context (SimulatorContext)
│   ├── data/             # Static scenario/config data
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Firebase & API service layers
│   ├── App.jsx           # Root app with screen router
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js        # Vite config (dev server on :3000, API proxy → :5000)
├── package.json
├── .env.example          # Environment variable template
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) account (for Gemini API key)
- *(Optional)* An [ElevenLabs](https://elevenlabs.io) account for AI voice
- *(Optional)* A [Firebase](https://firebase.google.com) project for auth & storage

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pubspeak.git
cd pubspeak
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Google Gemini AI (required)
GEMINI_API_KEY=your_google_api_key_here

# ElevenLabs TTS (optional — enables AI voice)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # Default: Rachel

# Firebase (optional — enables auth & progress tracking)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefgh

# Server port (default: 5000)
PORT=5000
```

### 4. Run the App

Run both the frontend and backend concurrently with a single command:

```bash
npm run dev:all
```

Or run them separately in two terminals:

```bash
# Terminal 1 — Express API server
npm run server

# Terminal 2 — Vite dev server
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:3000 |
| Backend (Express) | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Server health check — reports TTS & AI key status |
| `POST` | `/api/tts/speak` | Proxies text to ElevenLabs and streams audio back |
| `POST` | `/api/speaking/chat` | Sends user speech to Gemini AI, returns follow-up question |
| `POST` | `/api/speaking/evaluate` | Evaluates full session transcript, returns JSON scores |

> **Note:** All endpoints include server-side input validation. The `/api/speaking/chat` and `/api/speaking/evaluate` endpoints fall back to a built-in rule-based engine if the Gemini API key is missing or the API call fails.

---

## ⚙️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite frontend dev server |
| `npm run server` | Start Express backend server |
| `npm run dev:all` | Start both frontend & backend concurrently |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview the production build locally |

---

## 🌐 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Recommended | Google Gemini AI key for live AI responses |
| `ELEVENLABS_API_KEY` | ⬜ Optional | ElevenLabs key for AI voice synthesis |
| `ELEVENLABS_VOICE_ID` | ⬜ Optional | ElevenLabs voice ID (defaults to Rachel) |
| `VITE_FIREBASE_API_KEY` | ⬜ Optional | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ⬜ Optional | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ⬜ Optional | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ⬜ Optional | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ⬜ Optional | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | ⬜ Optional | Firebase app ID |
| `PORT` | ⬜ Optional | Backend server port (default: `5000`) |

> **Tip:** `VITE_` prefixed variables are safely exposed to the browser. Server-only keys (`GEMINI_API_KEY`, `ELEVENLABS_API_KEY`) are never sent to the client.

---

## 🔒 Security Notes

- **API keys never leave the server.** The browser only receives AI response text and audio binaries.
- **Payload limits** are enforced: user responses are capped at 5,000 characters; TTS text at 1,000 characters.
- **Server-side scoring** — evaluation results are always computed on the backend.
- The server automatically **increments the port** if the default is already in use.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is private. All rights reserved.
