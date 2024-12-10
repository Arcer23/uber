const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log("Connected to the Database Server");
    })
    .catch((error) => console.log(error));
}

module.exports = connectDB;
