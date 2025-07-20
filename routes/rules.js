const express = require("express");
const router = express.Router();
const rules = require("../data/rules.json");

router.post("/", (req, res) => {
  const message = req.body.message.toLowerCase();
  const match = Object.entries(rules).find(([room, rule]) =>
    message.includes(room.toLowerCase())
  );

  if (match) {
    return res.json({ chunk: { text: `Rules for ${match[0]}: ${match[1]}` } });
  }

  res.json({ chunk: { text: "Sorry, I couldn’t find the rules for that room." } });
});

module.exports = router;
