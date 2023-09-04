import { useState } from "react";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    gap: "0.5rem",
  };

  function handleRegistration(e) {
    e.preventDefault();
  }

  return (
    <div>
      <h1>Registration</h1>
      <form action="" style={formStyle} onSubmit={handleRegistration}>
        <label htmlFor="">Email</label>
        <input
          type="text"
          name="email"
          id=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          type="password"
          name="password"
          id=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="">Retype Password</label>
        <input
          type="password"
          name="confirmPassword"
          id=""
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button style={{ marginTop: "1rem" }}>Submit</button>
      </form>
    </div>
  );
}
