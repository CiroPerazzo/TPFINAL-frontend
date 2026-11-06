import { Link, NavLink, useLocation } from "react-router-dom";

const navigation = [
  ["/", "⌂", "Inicio"],
  ["/explorar", "⌕", "Explorar"],
  ["/biblioteca", "▤", "Biblioteca"],
  ["/colecciones", "▦", "Colecciones"],
  ["/estadisticas", "◫", "Estadísticas"],
  ["/perfil", "◉", "Perfil"],
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
        <Link className="brand" to="/">
          <span>◒</span> MUSICMAN
        </Link>
        <p className="sidebar-caption">TU ESPACIO MUSICAL</p>
        <nav aria-label="Navegación principal">
          {navigation.map(([path, icon, name]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive || (path === "/explorar" && pathname.startsWith("/detalle")) ? "active" : ""}`
              }
            >
              <span>{icon}</span>
              {name}
            </NavLink>
          ))}
        </nav>
        <Link className="sidebar-account" to="/perfil">
          <b>A</b>
          <span>Agustin Aiello · Cuenta personal</span>
        </Link>
      </aside>
  );
}
