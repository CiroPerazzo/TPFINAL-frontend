import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
const navigation = [
  ["/", "⌂", "Inicio"],
  ["/explorar", "⌕", "Explorar"],
  ["/biblioteca", "▤", "Biblioteca"],
  ["/colecciones", "▦", "Colecciones"],
  ["/estadisticas", "◫", "Estadísticas"],
  ["/perfil", "◉", "Perfil"],
];
export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const label =
    pathname === "/"
      ? "HOME"
      : pathname.startsWith("/detalle")
        ? "DETALLE"
        : navigation.find(([path]) => pathname === path)?.[2].toUpperCase() ||
          "COLECCIONES";
  return (
    <div className="app-shell">
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
        <div className="sidebar-note">
          <strong>Tu música, tus gustos.</strong>
          <p>Guardá la musica que te gusta escuchar.</p>
        </div>
        <Link className="sidebar-account" to="/perfil">
          <b>A</b>
          <span>Agustin Aiello · Cuenta personal</span>
        </Link>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                `/explorar?q=${encodeURIComponent(new FormData(e.currentTarget).get("q"))}`,
              );
            }}
          >
            <label className="header-search">
              <span>⌕</span>
              <input
                name="q"
                aria-label="Buscar música"
                placeholder="Buscar música"
              />
            </label>
          </form>
          <Link className="account-pill" to="/perfil">
            A&nbsp; Agustin Aiello
          </Link>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
