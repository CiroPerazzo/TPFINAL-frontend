import { useCallback, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Cover from "../components/ui/Cover.jsx";
import Stars from "../components/ui/Stars.jsx";
import Modal from "../components/ui/Modal.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { musicService } from "../services/musicService.js";
import { libraryService } from "../services/libraryService.js";
import { collectionService } from "../services/collectionService.js";
import { ratingService } from "../services/ratingService.js";
import { reviewService } from "../services/reviewService.js";
import { states } from "../services/models.js";
export default function Detail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const tipo = params.get("tipo") === "track" ? "track" : "album";

  // Carga principal: si falla esto no hay nada que mostrar.
  const mainLoader = useCallback(async () => {
    const [detail, libraryItems] = await Promise.all([
      musicService.detail(id, tipo),
      libraryService.list(),
    ]);
    const item = libraryItems.find(
      (i) => i.spotify_id === id && i.tipo === tipo,
    );
    const album = item ?? detail;
    return { album, item };
  }, [id, tipo]);
  const main = useResource(mainLoader);

  // Cargas secundarias independientes: su error se muestra en cada sección.
  const contentId = main.data?.album.contentId;
  const reviewLoader = useCallback(
    () =>
      contentId
        ? reviewService.get(contentId)
        : Promise.resolve({ review: null }),
    [contentId],
  );
  const reviewResource = useResource(reviewLoader);

  const collectionsResource = useResource(collectionService.list);

  const [modal, setModal] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
      setModal("");
      main.reload();
      reviewResource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (main.loading || main.error || !main.data)
    return <RequestState loading={main.loading} error={main.error} />;

  const { album, item } = main.data;
  const review = reviewResource.data?.review;
  const collections = collectionsResource.data ?? [];

  return (
    <div className="detail-page">
      <Link className="back-link" to="/explorar">
        ← Volver a explorar
      </Link>
      <RequestState error={error} />
      <div className="album-detail">
        <Cover {...album} />
        <div className="album-info">
          <small>
            {tipo === "album" ? "ÁLBUM" : "CANCIÓN"} · {album.year}
          </small>
          <h1>{album.title}</h1>
          <p>
            {album.artist}
            {album.tracks ? ` · ${album.tracks} canciones` : ""}
          </p>
          <p>{album.genre}</p>
          <div className="detail-actions">
            <button
              className="button primary"
              disabled={busy}
              onClick={() =>
                run(() =>
                  item
                    ? libraryService.remove(contentId)
                    : libraryService.add(album),
                )
              }
            >
              {item ? "Quitar de biblioteca" : "＋ Guardar en biblioteca"}
            </button>
            <button
              className="pill"
              disabled={busy || !item}
              onClick={() =>
                run(() => libraryService.favorite(contentId, !item.es_favorito))
              }
            >
              {item?.es_favorito ? "♥" : "♡"} Favorito
            </button>
            <button
              className="pill"
              disabled={busy}
              onClick={() => setModal("collection")}
            >
              ＋ Colección
            </button>
          </div>
        </div>
      </div>
      <section className="experience">
        <h2>Tu experiencia</h2>
        {!item && (
          <p>
            Guardá este contenido en tu biblioteca para cambiar su estado y
            puntuación.
          </p>
        )}
        <fieldset className="experience-card" disabled={busy || !item}>
          <div className="experience-controls">
            <label>
              Estado
              <select
                value={item?.estado || "quiero_escuchar"}
                onChange={(e) =>
                  run(() => libraryService.state(contentId, e.target.value))
                }
              >
                {Object.entries(states).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <span>Tu puntuación</span>
              <Stars
                value={item?.puntuacion || 0}
                onChange={(value) => {
                  if (!busy && item)
                    run(() => ratingService.set(contentId, value));
                }}
              />
              {item?.puntuacion && (
                <button
                  className="pill"
                  onClick={() => run(() => ratingService.clear(contentId))}
                >
                  Quitar puntuación
                </button>
              )}
            </div>
          </div>
        </fieldset>
        <div className="review-row">
          <RequestState
            loading={reviewResource.loading}
            error={reviewResource.error}
          />
          {!reviewResource.loading && !reviewResource.error && (
            <>
              <p>{review?.texto || "Todavía no escribiste una reseña."}</p>
              <button
                className="pill"
                disabled={busy}
                onClick={() => setModal("review")}
              >
                {review ? "Editar" : "Escribir"} reseña
              </button>
              {review && (
                <button
                  className="pill"
                  disabled={busy}
                  onClick={() => run(() => reviewService.remove(contentId))}
                >
                  Eliminar reseña
                </button>
              )}
            </>
          )}
        </div>
      </section>
      {modal && (
        <Modal
          title={modal === "review" ? "Tu reseña" : "Agregar a una colección"}
          onClose={() => setModal("")}
        >
          <RequestState error={error} />
          {modal === "review" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = new FormData(e.currentTarget).get("review");
                run(() => reviewService.save(contentId, text, Boolean(review)));
              }}
            >
              <label>
                Tu reseña
                <textarea
                  name="review"
                  defaultValue={review?.texto || ""}
                  required
                  maxLength={2000}
                />
              </label>
              <button className="button primary" disabled={busy}>
                Guardar reseña
              </button>
            </form>
          ) : (
            <div className="collection-options">
              <RequestState
                loading={collectionsResource.loading}
                error={collectionsResource.error}
              />
              {collections.map((c) => (
                <button
                  className="pill"
                  key={c.id}
                  disabled={busy}
                  onClick={() =>
                    run(() => collectionService.addItem(c.id, contentId))
                  }
                >
                  {c.nombre} ＋
                </button>
              ))}
              {!collectionsResource.loading &&
                !collectionsResource.error &&
                !collections.length && (
                  <Link to="/colecciones">Creá tu primera colección</Link>
                )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
