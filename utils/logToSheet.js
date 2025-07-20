const { google } = require("googleapis");
const credentials = JSON.parse(process.env.GOOGLE_CREDS);

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

async function ensureHeaders(sheets, spreadsheetId) {
  const expectedHeaders = [
    "Timestamp",
    "Phone",
    "Intent",
    "Message",
    "Chunk",
    "Check-in",
    "Check-out",
    "Outcome",
  ];

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "sheet1!A1:H1",
  });

  const currentHeaders = res.data.values?.[0] || [];

  const headersMismatch =
    currentHeaders.length !== expectedHeaders.length ||
    expectedHeaders.some((h, i) => currentHeaders[i] !== h);

  if (headersMismatch) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "sheet1!A1:H1",
      valueInputOption: "RAW",
      resource: {
        values: [expectedHeaders],
      },
    });
    console.log("Headers updated in Google Sheet");
  }
}

async function logToSheet(data) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.SHEET_ID;

  await ensureHeaders(sheets, spreadsheetId);

  const chunk = data.chunk || {};
  const values = [
    [
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.phone || "Unknown",
      data.intent || "None",
      data.message || "No message",
      JSON.stringify(chunk),
      chunk.checkIn || chunk.date || "",
      chunk.checkOut || "",
      data.outcome || "",
    ],
  ];

  console.log("Appending to sheet:", values);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "sheet1!A2",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values,
    },
  });

  console.log("Data logged to Google Sheet");
}

module.exports = logToSheet;
