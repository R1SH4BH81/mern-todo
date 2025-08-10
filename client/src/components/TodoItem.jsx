import React from "react";

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
        textDecoration: todo.completed ? "line-through" : "none",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
      <span style={{ flex: 1 }}>{todo.title}</span>
      <button onClick={() => onEdit(todo)} style={{ cursor: "pointer" }}>
        Edit
      </button>
      <button onClick={() => onDelete(todo._id)} style={{ cursor: "pointer" }}>
        Delete
      </button>
    </li>
  );
}
