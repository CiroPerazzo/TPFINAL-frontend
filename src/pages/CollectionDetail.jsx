import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { collectionService as service } from "../services/collectionService.js";
import { detailUrl } from "../services/models.js";

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loader = useCallback(() => service.detail(id), [id]);
  const resource = useResource(loader);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action, onSuccess = resource.reload) {
    setBusy(true);
    setError("");
    try {
      await action();
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const { collection, items } = resource.data || {};

  return (
    <div className="detail-page">
      <Link className="back-link" to="/colecciones">← Volver a colecciones</Link>
      <PageTitle title={collection?.nombre || "Colección"} />
      <RequestState loading={resource.loading || busy} error={error || resource.error} />
      {collection && (
        <>
          <form
            className="collection-form"
            onSubmit={(event) => {
              event.preventDefault();
              const name = new FormData(event.currentTarget).get("name");
              run(() => service.update(id, name));
            }}
          >
            <label>
              Nombre
              <input name="name" defaultValue={collection.nombre} required maxLength={100} />
            </label>
            <button className="pill" disabled={busy || resource.loading}>Guardar nombre</button>
          </form>
          <section className="collection-items">
            <h2>Contenido</h2>
            {items.map((item) => (
              <div className="review-row" key={item.contenido_id}>
                <Link to={detailUrl(item)}>{item.titulo} · {item.artista}</Link>
                <button
                  className="pill"
                  disabled={busy || resource.loading}
                  onClick={() => run(() => service.removeItem(id, item.contenido_id))}
                >
                  Quitar
                </button>
              </div>
            ))}
            {!items.length && (
              <div className="empty-collection">
                <p>Tu colección está vacía. Agregá música desde el detalle de un álbum o una canción.</p>
                <Link className="button primary" to="/explorar">
                  ＋ Agregar música
                </Link>
              </div>
            )}
          </section>
          <button
            className="pill"
            disabled={busy || resource.loading}
            onClick={() => {
              if (window.confirm("¿Eliminar esta colección?")) {
                run(() => service.remove(id), () => navigate("/colecciones", { replace: true }));
              }
            }}
          >
            Eliminar colección
          </button>
        </>
      )}
    </div>
  );
}
