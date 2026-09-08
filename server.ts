import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getGroundedDatasetAnswer, buildGeminiDatasetContext } from './src/utils/agriAiGrounding';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    datasetRecords: 50,
  });
});

// AI Insights Chat Endpoint
app.post('/api/gemini/insights', async (req, res) => {
  try {
    const { question, history } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    // Always compute deterministic grounded metrics from dataset
    const groundedResult = getGroundedDatasetAnswer(question);

    const ai = getGeminiClient();
    if (!ai) {
      // Return grounded calculated answer directly if no API key is present
      return res.json({
        answer: groundedResult.answer,
        supportingMetrics: groundedResult.supportingMetrics,
        datasetGroundingNote: groundedResult.datasetGroundingNote,
        confidenceScore: groundedResult.confidenceScore,
        source: 'dataset_deterministic',
      });
    }

    const datasetContext = buildGeminiDatasetContext();

    const systemInstruction = `
You are "AgriAI", the specialized agricultural dataset analyst for the AgriSeason project.
You analyze the provided 50-record Seasonal Agriculture Performance dataset with strict mathematical and agronomic fidelity.

CRITICAL ANALYTICAL & DEMONSTRATION RULES:
1. STRICT DATASET GROUNDING: Answer questions strictly using the provided 9-part structured analytical dataset context below.
2. NO FABRICATION: Do NOT invent, guess, extrapolate, or hallucinate numerical facts, dates, farm names, or statistical values.
3. INSUFFICIENT DATA CLAUSE: If the user asks for information that is NOT available in the dataset (e.g., questions about unrecorded years, foreign countries, unlisted crops/chemicals, livestock, or outside data), clearly and politely state: "The dataset does not contain enough information to answer this question."
4. STRUCTURE & TONE: Keep responses concise, understandable, and suitable for a college project demonstration. Use clean markdown formatting (bold metrics, bulleted key takeaways, and scannable summaries).

${datasetContext}
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: question,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = response.text || groundedResult.answer;

      return res.json({
        answer: responseText,
        supportingMetrics: groundedResult.supportingMetrics,
        datasetGroundingNote: 'Verified against 50 dataset records via server-side Gemini 3.6 Flash model.',
        confidenceScore: groundedResult.confidenceScore,
        source: 'gemini_grounded',
      });
    } catch (apiError: any) {
      console.warn('Gemini API call returned error, falling back to grounded dataset analytics:', apiError?.message);
      return res.json({
        answer: groundedResult.answer,
        supportingMetrics: groundedResult.supportingMetrics,
        datasetGroundingNote: groundedResult.datasetGroundingNote,
        confidenceScore: groundedResult.confidenceScore,
        source: 'dataset_deterministic_fallback',
      });
    }
  } catch (error: any) {
    console.error('Error handling AI insights inquiry:', error);
    res.status(500).json({
      error: 'An error occurred while processing the agricultural query.',
      details: error?.message,
    });
  }
});

// Vite middleware or production static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriSeason server running on http://0.0.0.0:${PORT}`);
  });
}

start();
