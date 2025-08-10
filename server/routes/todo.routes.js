const express = require("express");
const {
  getAll,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");
const router = express.Router();

router.get("/", getAll);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
