import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

import {
  registerUser,
  loginUser,
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  setToken,
  removeToken,
} from "./helper/apiHelper";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) loadTodos();
  }, [user]);

  const loadTodos = async () => {
    try {
      const res = await fetchTodos();
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    try {
      const res = await registerUser(authData);
      setToken(res.data.token);
      setUser(res.data);
      setAuthData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await loginUser({
        email: authData.email,
        password: authData.password,
      });
      setToken(res.data.token);
      setUser(res.data);
      setAuthData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setTodos([]);
  };

  const handleAddOrUpdate = async () => {
    if (!title.trim()) return;

    if (editId) {
      // update
      try {
        const res = await updateTodo(editId, { title });
        setTodos(todos.map((t) => (t._id === editId ? res.data : t)));
        setEditId(null);
        setTitle("");
      } catch (err) {
        console.error(err);
      }
    } else {
      // add
      try {
        const res = await addTodo(title);
        setTodos([...todos, res.data]);
        setTitle("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEdit = (todo) => {
    setTitle(todo.title);
    setEditId(todo._id);
  };

  const toggleCompleted = async (todo) => {
    try {
      const res = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <AuthForm
        authMode={authMode}
        authData={authData}
        error={error}
        onChange={handleAuthChange}
        onSubmit={authMode === "login" ? handleLogin : handleRegister}
        toggleMode={() => {
          setAuthMode(authMode === "login" ? "register" : "login");
          setError("");
        }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Todo List</h1>

      <button onClick={logout} style={{ marginBottom: 20, cursor: "pointer" }}>
        Logout
      </button>

      <TodoInput
        title={title}
        setTitle={setTitle}
        onAddOrUpdate={handleAddOrUpdate}
        editId={editId}
      />

      <TodoList
        todos={todos}
        onToggle={toggleCompleted}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
