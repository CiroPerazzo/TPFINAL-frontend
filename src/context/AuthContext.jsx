import { createContext, useState } from "react";

export const AuthContext = createContext(undefined);

// Estado de sesión en memoria; conectar con authService al integrar el backend.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}
