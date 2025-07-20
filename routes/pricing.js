const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const pricingData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/pricing.json"), "utf8")
);

router.post("/pricing", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const lowerMsg = message.toLowerCase();
  const knownProperties = [...new Set(pricingData.map(p => p["Property Name"]))];

  const matchedProperty = knownProperties.find(prop =>
    lowerMsg.includes(prop.toLowerCase())
  );

  if (!matchedProperty) {
    return res.json({
      chunk: {
        text: "Sorry, I couldn`t find any matching property name in your query.",
      },
      source: "pricing",
    });
  }

  const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/);
  const requestedDate = dateMatch ? dateMatch[0] : null;

  let matchedPrice = null;

  if (requestedDate) {
    matchedPrice = pricingData.find(
      (entry) =>
        entry["Property Name"].toLowerCase() === matchedProperty.toLowerCase() &&
        entry.date === requestedDate
    );
  }

  if (!matchedPrice) {
    matchedPrice = pricingData
      .filter(entry => entry["Property Name"].toLowerCase() === matchedProperty.toLowerCase())
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  if (matchedPrice) {
    return res.json({
      chunk: {
        text: `The price for ${matchedPrice["Property Name"]} on ${matchedPrice.date} is ₹${matchedPrice.price}.`,
      },
      source: "pricing",
    });
  } else {
    return res.json({
      chunk: {
        text: `Sorry, no pricing available for ${matchedProperty} at this time.`,
      },
      source: "pricing",
    });
  }
});

module.exports = router;
