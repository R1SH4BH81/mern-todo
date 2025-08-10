import React from "react";

export default function TodoInput({ title, setTitle, onAddOrUpdate, editId }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      <input
        type="text"
        placeholder="Enter todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ flex: 1, padding: 5 }}
      />
      <button onClick={onAddOrUpdate} style={{ cursor: "pointer" }}>
        {editId ? "Update" : "Add"}
      </button>
    </div>
  );
}
