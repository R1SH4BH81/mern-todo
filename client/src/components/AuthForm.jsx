import React from "react";

export default function AuthForm({
  authMode,
  authData,
  error,
  onChange,
  onSubmit,
  toggleMode,
}) {
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>{authMode === "login" ? "Login" : "Register"}</h2>

      {authMode === "register" && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={authData.name}
          onChange={onChange}
          style={{ width: "100%", marginBottom: 10, padding: 5 }}
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={authData.email}
        onChange={onChange}
        style={{ width: "100%", marginBottom: 10, padding: 5 }}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={authData.password}
        onChange={onChange}
        style={{ width: "100%", marginBottom: 10, padding: 5 }}
      />

      <button
        onClick={onSubmit}
        style={{ width: "100%", padding: 10, cursor: "pointer" }}
      >
        {authMode === "login" ? "Login" : "Register"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: 10 }}>
        {authMode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          onClick={toggleMode}
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
