const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose")
const db = require("./config/database");
const IdeaRoutes = require("./base/routes/idea/idea.route");
const UserRoutes = require("./base/routes/user/user.route");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// connect to mongoDB
(async() => {
  try {

    await mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false });

  } catch (err) {
    console.log(`Failed to connect to DB ${err}`);
  } finally {
    console.log('Connected to DB ');
  }
})();

app.use("/api", IdeaRoutes);
app.use("/api", UserRoutes);

app.use( (req, res, next) => {
  let error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use( (req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message
  });
});

module.exports = app;
