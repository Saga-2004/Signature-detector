# NimitAI Signal Detector

A simple AI-powered web application that analyzes sales meeting transcripts and identifies important conversation signals such as buying interest, objections, confusion, and follow-up requests. The application also provides a short coaching tip for each detected signal.

## Features

* Paste any sales meeting transcript
* AI-powered transcript analysis
* Detects:

  * Buying Interest
  * Objections
  * Confusion
  * Positive Sentiment
  * Negative Sentiment
  * Follow-up Requests
* Displays results as easy-to-read cards
* Returns structured JSON responses

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### AI Model

* Google Gemini 2.5 Flash

## Project Structure

nimitai-signal-detector/

├── frontend/

├── backend/

└── README.md

## Installation & Setup

### Clone Repository

git clone <repository-url>

cd nimitai-signal-detector

### Backend Setup

cd backend

npm install

Create a `.env` file:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

PORT=3000

Start backend:

npm start

### Frontend Setup

cd frontend

npm install

npm run dev

## API Endpoint

### POST /analyse

Request:

{
"transcript": "Your meeting transcript here"
}

Response:

{
"signals": [
{
"type": "buying_interest",
"quote": "That's actually interesting",
"tip": "Ask about their timeline now"
}
]
}

## Example Signals

* buying_interest
* objection
* confusion
* positive_sentiment
* negative_sentiment
* follow_up_request

## Assignment Information

This project was created as part of the NimitAI Intern Assignment.

The application analyzes meeting transcripts and extracts actionable sales signals using Google Gemini 2.5 Flash.
