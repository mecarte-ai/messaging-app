import { useState } from "react";
import { Navigate } from "react-router";

const apiURL = "http://206.189.91.54";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "50%",
  };

  async function handleLogin(username, password) {
    const res = await fetch(`${apiURL}/api/v1/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    let accessToken = {
      "access-token": res.headers.get("access-token"),
      client: res.headers.get("client"),
      expiry: res.headers.get("expiry"),
      uid: res.headers.get("uid"),
    };

    console.log(accessToken);
    setIsLogin(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleLogin(username, password);
  }

  if (isLogin) {
    return <Navigate to="/dashboard/" />;
  }

  return (
    <div className="">
      <form action="" style={formStyle} onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
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
    </div>
  );
}
