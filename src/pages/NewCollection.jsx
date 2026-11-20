import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import { collectionService as service } from "../services/collectionService.js";

export default function NewCollection() {
  const navigate = useNavigate();
  const returnTo = useLocation().state?.returnTo || "/colecciones";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create(event) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    setBusy(true);
    setError("");
    try {
      await service.create(name);
      navigate(returnTo, { replace: true });
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="detail-page">
      <Link className="back-link" to={returnTo}>← Volver</Link>
      <PageTitle title="Nueva colección" />
      <form className="collection-form" onSubmit={create}>
        <label>
          Nombre
          <input name="name" required maxLength={100} />
        </label>
        <button className="button primary" disabled={busy}>Crear colección</button>
        <RequestState loading={busy} error={error} />
      </form>
    </div>
  );
}
