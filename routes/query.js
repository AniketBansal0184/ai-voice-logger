const express = require("express");
const router = express.Router();
const queries = require("../data/queries.json");

router.post("/", (req, res) => {
  const message = req.body.message.toLowerCase();

  const match = Object.entries(queries).find(([room, query]) =>
    message.includes(room.toLowerCase())
  );

  if (match) {
    return res.json({ chunk: { text: query } });
  }

  res.json({ chunk: { text: "Sorry, I couldn`t find the answer to your query." } });
});

module.exports = router;
