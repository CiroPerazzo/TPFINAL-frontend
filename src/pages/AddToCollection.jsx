import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { collectionService as service } from "../services/collectionService.js";
import { libraryService } from "../services/libraryService.js";
import { musicService } from "../services/musicService.js";

export default function AddToCollection() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const tipo = params.get("tipo") === "track" ? "track" : "album";
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const backTo = `/detalle/${id}?tipo=${tipo}`;
  const loader = useCallback(async () => {
    const [items, collections] = await Promise.all([libraryService.list(), service.list()]);
    const music = items.find((item) => item.spotify_id === id && item.tipo === tipo)
      || await musicService.detail(id, tipo);
    return { music, collections };
  }, [id, tipo]);
  const resource = useResource(loader);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function add(collectionId) {
    setBusy(true);
    setError("");
    try {
      await service.addItem(collectionId, resource.data.music.contentId);
      navigate(backTo, { replace: true });
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="detail-page">
      <Link className="back-link" to={backTo}>← Volver al detalle</Link>
      <PageTitle title="Agregar a una colección" subtitle={resource.data?.music.title} />
      <RequestState loading={resource.loading || busy} error={error || resource.error} />
      {resource.data && (
        <div className="collection-options">
          {resource.data.collections.map((collection) => (
            <button className="pill" key={collection.id} disabled={busy} onClick={() => add(collection.id)}>
              {collection.nombre}
            </button>
          ))}
          {!resource.data.collections.length && (
            <Link className="button primary" to="/colecciones/nueva" state={{ returnTo: pathname + search }}>
              Creá tu primera colección
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
