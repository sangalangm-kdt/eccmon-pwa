require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const loginAuthRoutes = require("./login");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://sample-data-ice.netlify.app",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Use the separated routes
app.use("/", loginAuthRoutes);

module.exports.handler = serverless(app);
