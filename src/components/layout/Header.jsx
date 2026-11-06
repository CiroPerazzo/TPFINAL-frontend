import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
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
  );
}
