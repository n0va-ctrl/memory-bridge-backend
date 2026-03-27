const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

let memory = [];

// HARVEST
app.post("/api/harvest", (req, res) => {
  const { messages } = req.body;

  const lastMessage = messages[messages.length - 1]?.content;
  memory.push(lastMessage);

  res.json({
    reply: "Thanks for sharing that 💙",
  });
});

// CONVERSE
app.post("/api/converse", (req, res) => {
  const { messages, cognitiveState } = req.body;

  const lastMemory = memory[memory.length - 1] || "nothing yet";

  let reply =
    cognitiveState === "hard-day"
      ? `I'm here for you. You mentioned: ${lastMemory}`
      : `That reminds me — you said: ${lastMemory}`;

  res.json({ reply });
});

// SUMMARY
app.get("/api/summary", (req, res) => {
  res.json({
    summary: `Memories:\n${memory.join("\n")}`,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});