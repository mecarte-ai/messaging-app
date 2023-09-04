import Login from "./Login";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./AuthContext";
import Registration from "./Registration";
import { useEffect, useState } from "react";

export const apiURL = "http://206.189.91.54/api/v1";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/messaging-app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test" element={<Test />} />
          </Route>
          <Route path="*" element={<h1>Page 404 not found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Dashboard() {
  const { setIsLogin, accessData, setAccessData } = useAuth();
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    const response = await fetch(`${apiURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
    });

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function getUsers() {
      const fetchedUsers = await fetchUsers();
      const filter = await fetchedUsers.data.slice(0, 10);
      setUsers(filter);
    }

    getUsers();
  }, []);

  return (
    <div>
      Welcome, {accessData.uid}
      <button
        onClick={() => {
          setIsLogin(false);
          setAccessData(null);
        }}
      >
        Logout
      </button>
      {users && users.map((user) => <p key={user.uid}>{user.uid}</p>)}
    </div>
  );
}

function Test() {
  return <h1>Test</h1>;
}

function ProtectedRoute() {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
