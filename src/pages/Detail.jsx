import { useCallback, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Cover from "../components/ui/Cover.jsx";
import Stars from "../components/ui/Stars.jsx";
import Modal from "../components/ui/Modal.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { musicService } from "../services/musicService.js";
import { libraryService } from "../services/libraryService.js";
import { ratingService } from "../services/ratingService.js";
import { reviewService } from "../services/reviewService.js";
import { music, states } from "../services/models.js";
export default function Detail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const tipo = params.get("tipo") === "track" ? "track" : "album";
  const loader = useCallback(async () => {
    const items = await libraryService.list();
    const item = items.find((i) => i.spotify_id === id && i.tipo === tipo);
    const album = item || (await musicService.detail(id, tipo));
    const { review } = await reviewService.get(album.contentId);
    return { album, item, review };
  }, [id, tipo]);
  const resource = useResource(loader);
  const [reviewOpen, setReviewOpen] = useState(false);
  const reviewOpener = useRef(null);
  const [ratingDraft, setRatingDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action, { reload = true } = {}) {
    setBusy(true);
    setError("");
    try {
      await action();
      setReviewOpen(false);
      if (reload) resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function saveRating(value) {
    setBusy(true);
    setError("");
    try {
      const { item: updatedItem } = await (value === null
        ? ratingService.clear(contentId)
        : ratingService.set(contentId, value));
      resource.setData((current) => {
        if (current?.album?.contentId !== contentId) return current;
        const updated = music({ ...current.album, ...updatedItem });
        return { ...current, album: updated, item: updated };
      });
      setRatingDraft(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (resource.loading || resource.error || !resource.data)
    return <RequestState loading={resource.loading} error={resource.error} />;
  const { album, item, review } = resource.data;
  const contentId = album.contentId;
  const canWriteReview = Boolean(item || review);
  const savedRating = item?.puntuacion || 0;
  const selectedRating =
    ratingDraft?.contentId === contentId ? ratingDraft.value : savedRating;
  function updateReview(action) {
    return run(async () => {
      const nextReview = await action();
      resource.setData((current) =>
        current?.album?.contentId === contentId
          ? { ...current, review: nextReview }
          : current,
      );
    }, { reload: false });
  }

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
                  ? () =>
                      run(async () => {
                        await libraryService.remove(contentId);
                        setRatingDraft(null);
                      })
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
            <Link className="pill" to={`coleccion?tipo=${tipo}`}>
              ＋ Colección
            </Link>
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
                onChange={(e) => {
                  const value = e.target.value;
                  run(() => libraryService.state(contentId, value));
                }}
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
                value={selectedRating}
                onChange={(value) => setRatingDraft({ contentId, value })}
              />
              {selectedRating !== savedRating && (
                <button
                  type="button"
                  className="pill"
                  onClick={() => saveRating(selectedRating)}
                >
                  Guardar puntuación
                </button>
              )}
              {savedRating > 0 && (
                <button
                  type="button"
                  className="pill"
                  onClick={() => saveRating(null)}
                >
                  Quitar puntuación
                </button>
              )}
            </div>
          </fieldset>
        </div>
        <div className="review-row">
          <p>{review?.texto || (item ? "Todavía no escribiste una reseña." : "Guardá este contenido en tu biblioteca para escribir una reseña.")}</p>
          <button
            className="pill"
            disabled={busy || !canWriteReview}
            ref={reviewOpener}
            onClick={() => {
              setError("");
              setReviewOpen(true);
            }}
          >
            {review ? "Editar" : "Escribir"} reseña
          </button>
          {review && (
            <button
              className="pill"
              disabled={busy}
              onClick={() =>
                updateReview(async () => {
                  await reviewService.remove(contentId);
                  return null;
                })
              }
            >
              Eliminar reseña
            </button>
          )}
        </div>
      </section>
      {reviewOpen && canWriteReview && (
        <Modal
          openerRef={reviewOpener}
          title="Tu reseña"
          onClose={() => setReviewOpen(false)}
        >
          <RequestState error={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = new FormData(e.currentTarget).get("review");
              updateReview(async () => {
                const { review: savedReview } = await reviewService.save(
                  contentId,
                  text,
                  Boolean(review),
                );
                return savedReview;
              });
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
        </Modal>
      )}
    </div>
  );
}
