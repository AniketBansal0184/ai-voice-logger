const express = require("express");
const router = express.Router();
const axios = require("axios");
const logToSheet = require("../utils/logToSheet");
const rawRoomData = require("../data/chunked_roomInfo.json");
require("dotenv").config();
// const roomData = rawRoomData.flat();

// const normalizeRoom = (str) =>
//   (str || "")
//     .toLowerCase()
//     .trim()
//     .replace(/\s*rooms?$/i, "")
//     .replace(/^room\s*/i, "");

const BASE_API_URL = process.env.BASE_API_URL || "http://localhost:8000";

router.post("/retell", async (req, res) => {
  try {
    const { call, name, args } = req.body;
    const { user_id, phone_number, message, room, checkin, checkout, guests } = args || {};

    console.log("🟢 Received Request Args:", args);

    const missingFields = [];
    if (!room) missingFields.push("room");
    if (!checkin) missingFields.push("checkin");
    if (!checkout) missingFields.push("checkout");
    if (typeof guests !== "number") missingFields.push("guests");
    if (!message) missingFields.push("message");

    if (missingFields.length > 0) {
      console.warn("⚠️ Missing one or more required fields:", {
        room,
        checkin,
        checkout,
        guests,
        message
      });
      return res.status(400).json({
        tool_response: {
          message: `Missing required fields: ${missingFields.join(", ")}`
        }
      });
    }
    const classifyRes = await axios.post(`${BASE_API_URL}/api/classify`, {
      message,
    });

    let intent = classifyRes.data.intent.toLowerCase().trim();
    if (intent === "queries") intent = "query";
    if (intent === "cancellations") intent = "cancellation";

    let chunkRes;

    if (intent === "pricing") {
      chunkRes = await axios.post(`${BASE_API_URL}/api/pricing`, { message });
    } else if (intent === "rules") {
      chunkRes = await axios.post(`${BASE_API_URL}/api/rules`, { message });
    } else if (intent === "cancellation") {
      chunkRes = await axios.post(`${BASE_API_URL}/api/cancellation`, { message });
    } else if (intent === "query") {
      chunkRes = await axios.post(`${BASE_API_URL}/api/query`, { message });
    } else if (intent === "availability") {
      chunkRes = await axios.post(`${BASE_API_URL}/api/availability`, { room, checkin, checkout, guests });
    } else {
      chunkRes = {
        data: {
          chunk: { text: "Sorry, I didn`t understand that." },
          intent: "unknown",
        },
      };
    }

    const chunk = chunkRes.data.chunk;
    const ci = chunk.checkin || "";
    const co = chunk.checkout || "";
    const outcome = chunk.outcome || "";

    await logToSheet({
      phone: phone_number,
      intent,
      message,
      chunk,
      checkin: ci,
      checkout: co,
      outcome,
    });

    return res.json({
      message: chunk.text || JSON.stringify(chunk),
    });
  } catch (err) {
    console.error("Retell Webhook Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
