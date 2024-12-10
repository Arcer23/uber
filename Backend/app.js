const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const connectDB = require("../Backend/db/db.js");
const userRoutes = require("../Backend/routes/user.routes.js")
connectDB();
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/users',userRoutes)

module.exports = app;
