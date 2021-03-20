// Standard imports
const fs = require("fs");
const path = require("path");

// Module imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Local imports
// const contactRoutes = require("./routes/contact-routes");
const inventoryRoutes = require("./routes/inventories-routes");
const itemsRoutes = require("./routes/items-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// bodyparser middleware
app.use(bodyParser.json());

// File handler
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Header config
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Routes
// app.use("/api/contact", contactRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/users", usersRoutes);

// Error catch
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// File error handling - deletes the file on error
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

// DB config. Hides URI
const mongoURI = require("./config/keys").mongoURI;

// Mongoose config
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    app.listen(5000);
    console.log("Server starting on port 5000.");
  })
  .catch((err) => console.log(err));
