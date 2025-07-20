## ✅ **Final Polished README.md (Professional Level)**

````markdown
# 🏨 AI Voice Assistant – Hotel Booking via Retell AI

An enterprise-grade Node.js backend powering a **Retell AI voice agent** that handles hotel bookings, pricing queries, cancellations, and more — all with conversational intelligence and Google Sheets-based live logging.

---

## ☎️ Live Voice Agent (Production)

📞 **Call Now:** [+1 (989) 283-3242](tel:+19892833242)  
Speak naturally with the AI to ask about room availability, pricing, or rules.

🧠 Powered by GPT-4.1 + Retell Agent  
📈 All calls are logged to a secure Google Sheet in real-time.

---

## 🔗 Logs Dashboard

Track all interactions via centralized Google Sheets logging:  
📄 [Click to View Logs](https://docs.google.com/spreadsheets/d/1sjFog1WkQPPYZHFYfjQpEGAPPis8ZICH5jDB8TdYHzA/edit?gid=0)

---

## 🎯 Core Capabilities

- 🔊 AI-powered voice interaction (Retell Agent + OpenAI)
- 🏨 Room availability checks (using local JSON or DB)
- 🧾 Pricing, rules, and cancellation policy via intent classification
- 📤 Google Sheets logging of every call + response
- 🌍 Fully deployed backend on **Render** (zero config required)

---

## ⚙️ Tech Stack

| Area              | Stack                            |
|-------------------|----------------------------------|
| Voice Platform    | Retell AI                        |
| Intelligence      | OpenAI GPT-4.1                   |
| Backend           | Node.js + Express                |
| Deployment        | Render.com (production ready)    |
| Logging           | Google Sheets API                |
| Data              | JSON                             |

---

## 🧩 Key Endpoints (Internal Use)

### `POST /api/retell`
Webhook endpoint called by the Retell voice agent.

#### Payload Structure:
```json
{
  "call": { "call_id": "auto_generated" },
  "args": {
    "phone_number": "+1 (989) 283-3242",
    "message": "Do you have any premium rooms available?",
    "room": "Amani Premium",
    "checkin": "2025-01-01",
    "checkout": "2025-01-05",
    "guests": 3
  }
}
````

---

## 🔐 Environment Configuration

All credentials and dynamic settings are handled securely via environment variables. No secrets are committed to version control.

### Required `.env` Variables:

| Variable Name      | Description                                      |
| ------------------ | ------------------------------------------------ |
| `GOOGLE_CREDS`     | Google Sheets service account (JSON stringified) |
| `EXTERNAL_API_URL` | Base URL for internal classification APIs        |
| `PORT`             | Port Number                                      |
| `SHEET_ID`         | YOUR GOOGLE SHEET ID                             |

> **Note:** On Render, these are configured via the Environment tab in the dashboard.

---

## 🚀 Render Deployment

This project is fully hosted and auto-deployed via **Render**. No local setup is required. Just push to GitHub and the agent remains live 24/7.

### Render Setup:

| Field         | Value            |
| ------------- | ---------------- |
| Language      | Node             |
| Build Command | `npm install`    |
| Start Command | `node server.js` |
| Instance Type | Free / Starter   |
| Region        | Oregon (US West) |

---

## 🧠 Example Use Cases

* “Do you have any deluxe rooms for 3 guests from Jan 2 to Jan 5?”
* “What's your cancellation policy?”
* “Tell me about pricing for the Amani Suite.”

All such requests are processed in real-time and logged for transparency.

---

## ✅ Status

* ✅ Live Voice Agent: **Working**
* ✅ Sheets Logging: **Live**
* ✅ Intent Classification: **Integrated**
* ✅ Availability Logic: **Dynamic & Modular**
* ✅ Deployment: **Production-ready on Render**

