import { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";
export const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    authService
      .me()
      .then(({ user }) => {
        if (active) setUser(user);
      })
      .catch((e) => {
        if (active && e.status !== 401) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const expired = () => setUser(null);
    window.addEventListener("session-expired", expired);
    return () => {
      active = false;
      window.removeEventListener("session-expired", expired);
    };
  }, []);
  const authenticate = async (action, body) => {
    const { user } = await authService[action](body);
    setUser(user);
    setError("");
  };
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        isAuthenticated: Boolean(user),
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
