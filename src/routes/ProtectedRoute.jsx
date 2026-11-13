import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

// Aplicar a las rutas privadas cuando se conecte la autenticación.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p role="status">Cargando sesión…</p>;
  return isAuthenticated ? (children ?? <Outlet />) : <Navigate to="/login" state={{ from: location }} replace />;
}
