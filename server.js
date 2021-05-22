const express = require("express");

const connectDB = require("./config/db");

const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENT.split(",")
};

app.use(cors(corsOptions));

app.use(express.json());

// Template engine
app.set("views", path.join(__dirname, "/views"));

app.set("view engine", "ejs");

app.use("/api/files", require("./routes/files"));

app.use(express.static("public"));

app.use("/files", require("./routes/show"));

app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Server is created on ${PORT}`);
});
