import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth requiere AuthProvider.");
  return context;
}
