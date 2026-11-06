import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

// Aplicar a las rutas privadas cuando se conecte la autenticación.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (children ?? <Outlet />) : <Navigate to="/login" state={{ from: location }} replace />;
}
