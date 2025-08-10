const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todo.routes");
const userRoutes = require("./routes/user.routes");
dotenv.config();
const protect = require("./middleware/auth.middleware");
const connectDB = require("./connection");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/api/todos", protect, todoRoutes);
app.use("/api/users", userRoutes);

app.listen(4000, () => {
  console.log("server is running");
});
