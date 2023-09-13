import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );
  const [accessData, setAccessData] = useState(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(accessData));
  }, [accessData]);

  useEffect(() => {
    localStorage.setItem("isLogin", isLogin.toString());
  }, [isLogin]);

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, accessData, setAccessData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
