const express = require("express");
const fs = require("fs");
const path = require("path");
const logToSheet = require("../utils/logToSheet");

const router = express.Router();

function loadChunks(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, `../data/${filename}`), "utf8"));
}

router.post("/classify", (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("availability") || lowerMsg.includes("available") || lowerMsg.includes("vacant") || lowerMsg.includes("check availability")) {
    return res.json({ intent: "availability" });
  }
  if (lowerMsg.includes("price") || lowerMsg.includes("cost")) return res.json({ intent: "pricing" });
  if (lowerMsg.includes("book") || lowerMsg.includes("room")) return res.json({ intent: "room_info" });
  if (lowerMsg.includes("check") || lowerMsg.includes("id") || lowerMsg.includes("policy")) return res.json({ intent: "rules" });

  return res.json({ intent: "queries" });
});


router.post("/fetch", (req, res) => {
  const { intent } = req.body;
  let file;
  switch (intent) {
    case "room_info": file = "roomInfo.json"; break;
    case "pricing": file = "pricing.json"; break;
    case "rules": file = "rules.json"; break;
    case "queries": file = "queries.json"; break;
    default: return res.status(400).json({ error: "Invalid intent" });
  }
  const data = loadChunks(file);
  return res.json({ chunk: data[0] });
});

router.post("/log", async (req, res) => {
  try {
    await logToSheet(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
