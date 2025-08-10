const Todo = require("../models/todo.models");

//get all

const getAll = async (req, res) => {
  try {
    const todo = await Todo.find();
    res.json(todo);
  } catch (err) {
    res.status(500).json(`error : ${err.message}`);
  }
};

const createTodo = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    const { title } = req.body;
    if (!title) return res.status(400).json(`title is required`);
    const todo = new Todo({ title });
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json(`error : ${err.message}`);
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!todo) return res.status(400).json("not found - todo");
    res.json(todo);
  } catch (err) {
    res.status(500).json(`error : ${err.message}`);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(400).json("not found - todo");
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json(`error : ${err.message}`);
  }
};

module.exports = { getAll, createTodo, updateTodo, deleteTodo };
