import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(
    sessionStorage.getItem("isLogin") === "true"
  );
  const [accessData, setAccessData] = useState(
    sessionStorage.getItem("token")
      ? JSON.parse(sessionStorage.getItem("token"))
      : null
  );

  useEffect(() => {
    sessionStorage.setItem("token", JSON.stringify(accessData));
  }, [accessData]);

  useEffect(() => {
    sessionStorage.setItem("isLogin", isLogin.toString());
  }, [isLogin]);

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, accessData, setAccessData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
