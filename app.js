const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ debug: process.env.DEBUG });
const cors = require("cors");
const mongoose = require("mongoose")
const IdeaRoutes = require("./base/routes/idea/idea.route");
const UserRoutes = require("./base/routes/user/user.route");

const app = express();
// const dotenv = require("dotenv");
// const {MONGO_URI} = process.env;
// const buf = Buffer.from("MONGO_URI");
// const opt = { debug: true };
// const config = dotenv.parse(buf, opt);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// console.log(`${process.env.PORT}`);
// connect to mongoDB
(async() => {
  try {

    const connectmDB = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false });

    if(connectmDB) {
    console.log(`Connected to DB`);
    }

  } catch (err) {
    console.log(`Failed to connect to DB ${err}`);
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
