const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (simple for hackathon)
let memory = [];

/**
 * HARVEST ROUTE (Interview)
 * Saves user memory
 */
app.post("/api/harvest", (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ reply: "No messages provided" });
    }

    const lastMessage = messages[messages.length - 1]?.content;

    if (lastMessage) {
      memory.push(lastMessage);
    }

    res.json({
      reply: "Thanks for sharing that 💙",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error saving memory" });
  }
});

/**
 * CONVERSE ROUTE (Companion)
 * Uses memory + adapts tone
 */
app.post("/api/converse", (req, res) => {
  try {
    const { messages, cognitiveState } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ reply: "No messages provided" });
    }

    const lastMemory =
      memory.length > 0
        ? memory[memory.length - 1]
        : "I’m still getting to know you";

    let reply =
      cognitiveState === "hard-day"
        ? `I’m here with you 💙 You mentioned: ${lastMemory}`
        : `That reminds me — you told me: ${lastMemory}`;

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error generating response" });
  }
});

/**
 * SUMMARY ROUTE (Dashboard)
 * Returns stored memories
 */
app.get("/api/summary", (req, res) => {
  try {
    res.json({
      summary:
        memory.length > 0
          ? `Memories:\n${memory.join("\n")}`
          : "No memories yet",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ summary: "Error generating summary" });
  }
});

/**
 * HEALTH CHECK (optional but useful)
 */
app.get("/", (req, res) => {
  res.send("Memory Bridge API is running 🚀");
});

/**
 * IMPORTANT: Azure-compatible PORT
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});