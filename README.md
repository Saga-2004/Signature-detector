# NimitAI Signal Detector
A production-ready full-stack web app that analyzes sales meeting transcripts and extracts actionable signals using AI.

**LLM Used**: Google Gemini API → `gemini-2.5-flash` model (via `@google/genai` SDK)

## Setup

### Backend
```bash
cd backend
npm install
```
Add your Google Gemini API key to `.env`.
Get a free key at: [Google AI Studio](https://aistudio.google.com/app/apikey)

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Start the backend server:
```bash
npm start
```
Server runs at http://localhost:3000

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Opens at http://localhost:5173

## API
- `POST /analyse` 
- Body: `{ "transcript": "..." }` 
- Returns: `{ "signals": [...] }`
