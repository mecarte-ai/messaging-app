import { useState } from "react";
import { apiURL } from "./App";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    gap: "0.5rem",
  };

  async function handleRegistration(e) {
    e.preventDefault();

    const newUser = {
      email,
      password,
      password_confirmation: confirmPassword,
    };

    // console.log(newUser);

    const res = await fetch(`${apiURL}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      alert("successful registration!");
      navigate("/");
    } else {
      alert("not successful");
    }

    console.log(res);
  }

  return (
    <div>
      <h1>Registration</h1>
      <form action="" style={formStyle} onSubmit={handleRegistration}>
        <label htmlFor="">Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="">Retype Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button style={{ marginTop: "1rem" }}>Submit</button>
      </form>
    </div>
  );
}
