import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Sponsorship API Endpoint (PlanetScale PostgreSQL)
app.post("/api/sponsorship", async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for PlanetScale/Neon/Hyperdrive
  });

  try {
    await client.connect();
    const { name, hp, amount, type, message } = req.body;

    const query = `
      INSERT INTO sponsorship (sp_name, sp_hp, sp_amount, sp_type, sp_message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING sp_id;
    `;
    
    const result = await client.query(query, [name, hp, amount, type, message]);
    res.json({ success: true, id: result.rows[0].sp_id });
  } catch (error: any) {
    console.error("DB Error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.end();
  }
});

app.get("/api/sponsorship", async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const query = 'SELECT * FROM sponsorship ORDER BY sp_datetime DESC LIMIT 10;';
    const result = await client.query(query);
    
    // Format output to match the DonationTracker expectations
    const formattedData = result.rows.map(row => ({
      id: `TRX-${row.sp_id.toString().padStart(4, '0')}`,
      date: new Date(row.sp_datetime).toISOString().split('T')[0],
      description: row.sp_message || `${row.sp_type === 'regular' ? '정기' : '일시'} 후원금 결산`,
      amount: row.sp_amount,
      type: 'income',
      category: row.sp_type === 'regular' ? '정기후원' : '일시후원'
    }));

    res.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error("DB Error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.end();
  }
});

// DB Status API Endpoint
app.get("/api/db-status", async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ success: false, status: 'disconnected', error: "Database not configured" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT version();');
    res.json({ 
      success: true, 
      status: 'connected', 
      version: result.rows[0].version 
    });
  } catch (error: any) {
    console.error("DB Connection Error:", error);
    res.status(500).json({ success: false, status: 'error', error: error.message });
  } finally {
    await client.end();
  }
});

// Chatbot API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // System instruction to act as a helpful assistant for North Korean defectors
    const systemInstruction = `You are a helpful and compassionate support chatbot for the "하나사랑협회" (Hana Sarang Association), an organization supporting North Korean defectors in their resettlement in South Korea.
Answer questions about support programs, resettlement resources, legal guidance, and community events.
Be polite, professional, and encouraging. Answer in Korean.`;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    
    // Send history if exists (we'd need to properly format it for the SDK if we want full history, 
    // but for this basic FAQ bot, we'll just send the current message for simplicity, or format history if needed.
    // To keep it simple, we'll just send the user message).
    
    const response = await chat.sendMessage({ message });
    
    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
