import { useCallback, useRef, useState } from "react";
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
  const loader = useCallback(async () => {
    const [items, collections] = await Promise.all([
      libraryService.list(),
      collectionService.list(),
    ]);
    const item = items.find((i) => i.spotify_id === id && i.tipo === tipo);
    const album = item || (await musicService.detail(id, tipo));
    const { review } = await reviewService.get(album.contentId);
    return { album, item, review, collections };
  }, [id, tipo]);
  const resource = useResource(loader);
  const [modal, setModal] = useState("");
  const modalOpener = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
      setModal("");
      resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (resource.loading || resource.error || !resource.data)
    return <RequestState loading={resource.loading} error={resource.error} />;
  const { album, item, review, collections } = resource.data;
  const contentId = album.contentId;
  const saveToLibrary = () => run(() => libraryService.add(album));
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
              onClick={
                item
                  ? () => run(() => libraryService.remove(contentId))
                  : saveToLibrary
              }
            >
              {item ? "Quitar de biblioteca" : "Guardar en biblioteca"}
            </button>
            <button
              className="pill"
              disabled={busy || !item}
              onClick={() =>
                run(() => libraryService.favorite(contentId, !item.es_favorito))
              }
            >
              {item?.es_favorito ? "Quitar favorito" : "Marcar favorito"}
            </button>
            <button
              className="pill"
              disabled={busy}
              onClick={(e) => {
                modalOpener.current = e.currentTarget;
                setModal("collection");
              }}
            >
              Agregar a colección
            </button>
          </div>
        </div>
      </div>
      <section className="experience">
        <h2>Tu experiencia</h2>
        <div className="experience-card">
          {!item && (
            <div className="experience-setup">
              <p>
                Guardá este contenido en tu biblioteca para cambiar su estado y
                puntuarlo.
              </p>
              <button
                className="button primary"
                disabled={busy}
                onClick={saveToLibrary}
              >
                Guardar en biblioteca
              </button>
            </div>
          )}
          <fieldset
            className="experience-controls"
            aria-label="Estado y puntuación"
            disabled={busy || !item}
          >
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
              <span>
                Tu puntuación{item?.puntuacion ? ` · ${item.puntuacion}/5` : ""}
              </span>
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
          </fieldset>
          <section className="detail-review">
            <h3>Tu reseña</h3>
            <p>{review?.texto || "Todavía no escribiste una reseña."}</p>
            <div className="detail-review-actions">
              <button
                className="pill"
                disabled={busy}
                onClick={(e) => {
                  modalOpener.current = e.currentTarget;
                  setModal("review");
                }}
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
            </div>
          </section>
        </div>
      </section>
      {modal && (
        <Modal
          openerRef={modalOpener}
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
              {!collections.length && (
                <Link to="/colecciones">Creá tu primera colección</Link>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
