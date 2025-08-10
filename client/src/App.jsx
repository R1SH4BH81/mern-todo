import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/todos";
export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post(API_URL, { title });
      setTodos([...todos, res.data]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedFields);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setTitle("");
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (todo) => {
    setTitle(todo.title);
    setEditId(todo._id);
  };

  const toggleCompleted = (todo) => {
    updateTodo(todo._id, { completed: !todo.completed });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>Todo List</h1>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Enter todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />
        <button
          onClick={editId ? () => updateTodo(editId, { title }) : addTodo}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo)}
            />
            <span style={{ flex: 1 }}>{todo.title}</span>
            <button onClick={() => startEdit(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
