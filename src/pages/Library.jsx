import { useState } from "react";
import { Link } from "react-router-dom";
import Cover from "../components/ui/Cover.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import LibraryFilters from "../components/library/LibraryFilters.jsx";
import Stars from "../components/ui/Stars.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { libraryService } from "../services/libraryService.js";
import { detailUrl } from "../services/models.js";
export default function Library() {
  const resource = useResource(libraryService.list);
  const [tab, setTab] = useState("Todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recientes");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const results = (resource.data || []).filter(
    (a) =>
      `${a.title} ${a.artist}`.toLowerCase().includes(query.toLowerCase()) &&
      (tab === "Todos" ||
        (tab === "Favoritos" ? a.es_favorito : a.status === tab)),
  );
  if (sort === "nombre") results.sort((a, b) => a.title.localeCompare(b.title));
  async function favorite(a) {
    setBusy(true);
    setError("");
    try {
      await libraryService.favorite(a.contentId, !a.es_favorito);
      resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="Tu biblioteca"
        subtitle="Tu música guardada, organizada a tu manera."
      >
        <Link className="button primary" to="/explorar">
          ＋ Agregar música
        </Link>
      </PageTitle>
      <RequestState
        loading={resource.loading}
        error={error || resource.error}
      />
      <LibraryFilters {...{ tab, setTab, query, setQuery, sort, setSort }} />
      <table className="library-table">
        <thead>
          <tr>
            <th>CONTENIDO</th>
            <th>ESTADO</th>
            <th>PUNTUACIÓN</th>
            <th>FAVORITO</th>
          </tr>
        </thead>
        <tbody>
          {results.map((a) => (
            <tr key={a.id}>
              <td>
                <Link className="library-album" to={detailUrl(a)}>
                  <Cover {...a} className="mini-cover" />
                  <div>
                    <strong>{a.title}</strong>
                    <span>{a.artist}</span>
                  </div>
                </Link>
              </td>
              <td>
                <span className="pill status">{a.status}</span>
              </td>
              <td>
                <Stars value={a.puntuacion || 0} />
              </td>
              <td>
                <button
                  disabled={busy || resource.loading}
                  className="favorite-button"
                  aria-label={`${a.es_favorito ? "Quitar" : "Agregar"} favorito`}
                  onClick={() => favorite(a)}
                >
                  {a.es_favorito ? "♥" : "♡"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!resource.loading && !resource.error && !results.length && (
        <p className="empty">No encontramos música con esos filtros.</p>
      )}
    </>
  );
}
