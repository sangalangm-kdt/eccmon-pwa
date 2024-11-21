require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./route/index");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://sample-ice-qr.vercel.app",
];

// Middleware
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"], // Allow only GET and POST methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors(corsOptions)); // Handle preflight requests
app.use(cookieParser());

// Routers
app.use(routes);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
