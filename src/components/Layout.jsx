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
          <span>◒</span> SONORA
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
          <strong>Tu música, a tu manera.</strong>
          <p>Guardá lo que te gusta y descubrí tu historia.</p>
        </div>
        <Link className="sidebar-account" to="/perfil">
          <b>C</b>
          <span>Ciro · Cuenta personal</span>
        </Link>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>MY COLLECTION&nbsp; / &nbsp;{label}</span>
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
            C&nbsp; Ciro
          </Link>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
