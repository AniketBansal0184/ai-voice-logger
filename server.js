const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const infoRoutes = require("./routes/info");
const retellWebhook = require("./routes/retellWebhook");
const pricingRoute = require("./routes/pricing");
const rulesRoute = require("./routes/rules");
const cancellationRoute = require("./routes/cancellation");
const queryRoute = require("./routes/query");
const availabilityRoute = require('./routes/availability');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", infoRoutes);
app.use("/api", retellWebhook);
app.use("/api", pricingRoute);
app.use("/api/rules", rulesRoute);
app.use("/api/cancellation", cancellationRoute);
app.use("/api/query", queryRoute);
app.use("/api", availabilityRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
