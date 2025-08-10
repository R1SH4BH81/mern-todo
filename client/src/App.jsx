import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Axios instance that injects token automatically if present
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  // Auth state
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // or "register"
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Auth Handlers
  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    try {
      const res = await axios.post(`${API_URL}/users/register`, authData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setAuthData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email: authData.email,
        password: authData.password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setAuthData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTodos([]);
  };

  // Todo Handlers (same as before, using axiosInstance)
  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const res = await axiosInstance.post(`${API_URL}/todos`, { title });
      setTodos([...todos, res.data]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const res = await axiosInstance.put(
        `${API_URL}/todos/${id}`,
        updatedFields
      );
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setTitle("");
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/todos/${id}`);
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

  // UI
  if (!user) {
    return (
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <h2>{authMode === "login" ? "Login" : "Register"}</h2>

        {authMode === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={authData.name}
            onChange={handleAuthChange}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={authData.email}
          onChange={handleAuthChange}
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={authData.password}
          onChange={handleAuthChange}
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />

        <button
          onClick={authMode === "login" ? handleLogin : handleRegister}
          style={{ width: "100%", padding: "10px" }}
        >
          {authMode === "login" ? "Login" : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p style={{ marginTop: "10px" }}>
          {authMode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setError("");
            }}
            style={{
              color: "blue",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {authMode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>Todo List</h1>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

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
