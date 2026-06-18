import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
console.log("API KEY loaded:", !!process.env.GEMINI_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Adjust as needed
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 3000;

app.post("/analyse", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || transcript.trim() === "") {
      return res.status(400).json({ error: "Transcript is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Server Configuration Error",
        details: "GEMINI_API_KEY is not set.",
      });
    }

    // Initialize the official Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are a sales conversation analyst. Analyze the given meeting transcript and extract key signals.
For each signal return:
- type: one of "buying_interest", "objection", "confusion", "positive_sentiment", "negative_sentiment", "follow_up_request"
- quote: exact short quote from transcript showing this signal (max 15 words)
- tip: one-line actionable coaching tip for sales rep (max 12 words)

Return ONLY valid JSON, no markdown, no extra text. Format exactly as:
{
  "signals": [
    {
      "type": "buying_interest",
      "quote": "...",
      "tip": "..."
    }
  ]
}`;

    // Call Gemini 2.5 Flash with robust retry logic for 503 "High Demand" errors
    let responseText = null;
    let attempt = 1;
    let delay = 2000; // Start with 2 seconds

    while (true) {
      try {
        console.log(`[Attempt ${attempt}] Sending request to Gemini API...`);
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: transcript,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
          },
        });

        responseText = response.text;
        console.log(`[Success] Received response on attempt ${attempt}`);
        break; // Success! Exit the loop
      } catch (apiError) {
        // If it's a 503 error (High Demand), wait and retry indefinitely as requested
        if (apiError.message && apiError.message.includes("503")) {
          console.warn(
            `[Warning] Model unavailable (503 High Demand). Retrying in ${delay / 1000} seconds...`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          // Exponential backoff capped at 10 seconds
          delay = Math.min(delay * 2, 10000);
          attempt++;
        } else {
          // If it's some other error (like 401 Unauthorized), throw it
          throw apiError;
        }
      }
    }

    if (!responseText || responseText.trim() === "") {
      console.error("Empty content received from AI.");
      return res.status(502).json({
        error: "Empty AI response",
        details: "The AI returned an empty response.",
      });
    }

    let parsed;
    try {
      // Strips markdown if the model ignores `responseMimeType`
      const sanitizedText = responseText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      parsed = JSON.parse(sanitizedText);

      if (!parsed.signals || !Array.isArray(parsed.signals)) {
        throw new Error(
          "Parsed JSON does not contain the required 'signals' array.",
        );
      }
    } catch (parseError) {
      console.error("JSON Parsing Error. Raw Content:", responseText);
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: "The AI returned improperly formatted data.",
      });
    }

    // Success
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Endpoint Error:", err.message);
    return res.status(502).json({
      error: "Analysis failed",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
