const express = require("express");
const router = express.Router();
const roomInfo = require("../data/roomInfo.json");

router.post("/", (req, res) => {
  const message = req.body.message.toLowerCase();

  const match = Object.entries(roomInfo).find(([room, info]) =>
    message.includes(room.toLowerCase())
  );

  if (match) {
    const cancellation = match[1].cancellation || "No cancellation policy listed.";
    return res.json({ chunk: { text: `Cancellation policy for ${match[0]}: ${cancellation}` } });
  }

  res.json({ chunk: { text: "Sorry, I couldn`t find the cancellation policy for that room." } });
});

module.exports = router;
