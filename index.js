const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cors = require("cors");
const app = express();
const cloudinary = require("cloudinary").v2;
app.use(formidable());
app.use(cors());

// Allows access to environment variables

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/vinted", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection to the cloudinary storage space

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connecté à Mongoose");
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
const paymentRoutes = require("./routes/payment");
app.use(userRoutes);
app.use(offerRoutes);
app.use(paymentRoutes);

app.get("/", (req, res) => {
  res.json("Bienvenue sur l'API de Vinted");
});

app.use(function (err, req, res, next) {
  res.json({ error: err.message });
});

app.all("*", (req, res) => {
  res.status(404).send({ message: "Page not found" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started");
});
