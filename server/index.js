const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todo.routes");
dotenv.config();
const connectDB = require("./connection");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome");
});
app.use("/api/todos", todoRoutes);

app.listen(4000, () => {
  console.log("server is running");
});
