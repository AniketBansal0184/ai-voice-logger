const express = require("express");
const router = express.Router();
const rawRoomData = require("../data/chunked_roomInfo.json");

const roomData = rawRoomData.flat();

const normalizeRoom = (str) =>
  (str || "")
    .toLowerCase()
    .trim()
    .replace(/\s*rooms?$/i, "")
    .replace(/^room\s*/i, "");

router.post("/availability", (req, res) => {
  const { room, checkin, checkout, guests } = req.body;

  if (!room || !checkin || !checkout || typeof guests !== "number") {
    return res.status(400).json({
      chunk: {
        text: "Missing room, check-in, check-out, or guest information.",
        outcome: "Unavailable",
      },
    });
  }

  const requestedRoom = normalizeRoom(room);
  const matchedRoom = roomData.find((r) => {
    const roomName = normalizeRoom(r["room_name"]);
    return roomName === requestedRoom || roomName.includes(requestedRoom);
  });

  if (!matchedRoom) {
    const allNames = roomData.map((r) => r["room_name"]).join(", ");
    return res.json({
      chunk: {
        text: `Sorry, we couldn't find availability for "${room}". Available rooms are: ${allNames}.`,
        outcome: "Unavailable",
      },
    });
  }

  const available = parseInt(matchedRoom["Total number_of_rooms Available"]);
  const maxGuests = parseInt(matchedRoom["Max Guests"]);

  if (guests > maxGuests) {
    return res.json({
      chunk: {
        text: `The ${matchedRoom["room_name"]} allows up to ${maxGuests} guests. You requested ${guests}.`,
        checkin,
        checkout,
        outcome: "Unavailable",
      },
    });
  }

  if (available > 0) {
    return res.json({
      chunk: {
        text: `Yes, ${matchedRoom["room_name"]} is available! ${available} room(s) from ${checkin} to ${checkout} for ${guests} guest(s).`,
        checkin,
        checkout,
        outcome: "Available",
      },
    });
  } else {
    return res.json({
      chunk: {
        text: `Sorry, the ${matchedRoom["room_name"]} is fully booked from ${checkin} to ${checkout}.`,
        checkin,
        checkout,
        outcome: "Unavailable",
      },
    });
  }
});

module.exports = router;
