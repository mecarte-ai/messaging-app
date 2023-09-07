import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { apiURL } from "./App";

export default function Login() {
  const { isLogin, setIsLogin, setAccessData } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "50%",
  };

  async function handleLogin() {
    const res = await fetch(`${apiURL}/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (!res.ok) {
      alert("Login not successful!");
      return;
    }

    const data = await res.json();

    console.log(data);

    let accessToken = await {
      id: data.data.id,
      "access-token": res.headers.get("access-token"),
      client: res.headers.get("client"),
      expiry: res.headers.get("expiry"),
      uid: res.headers.get("uid"),
    };

    console.log(accessToken);

    setAccessData(accessToken);
    setIsLogin(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleLogin();
  }

  if (isLogin) {
    return <Navigate to="/dashboard/" />;
  }

  return (
    <div className="">
      <form action="" style={formStyle} onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      New User? <Link to="/register">Register here</Link>
    </div>
  );
}
