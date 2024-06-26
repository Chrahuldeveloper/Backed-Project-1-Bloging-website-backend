const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8080;
const {
  signUpRouter,
  blogUpload,
  blogLikes,
  blogViews,
  reffer,
} = require("./routers/index");
app.use(express.json());

const startServer = async () => {
  return console.log(`Server Started at http://localhost:${PORT}`);
};

// connection to db
const dbconnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("db Connection established");
  } catch (error) {
    console.log(error);
  }
};

app.use("/", signUpRouter);
app.use("/", blogUpload);
app.use("/", blogLikes);
app.use("/", blogViews);
app.use("/", reffer);

app.listen(PORT, () => {
  startServer();
  dbconnection();
});
