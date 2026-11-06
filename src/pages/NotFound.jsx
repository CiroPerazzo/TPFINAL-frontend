import { Link } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle.jsx";

export default function NotFound() {
  return (
    <>
              <PageTitle
                title="Página no encontrada"
                subtitle="Volvé a tu espacio musical."
              />
              <Link className="button primary" to="/">
                Ir al inicio
              </Link>
            </>
  );
}
