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
    return { album, item, id, tipo };
  }, [id, tipo]);
  const main = useResource(mainLoader);
  const currentDetail =
    main.data?.id === id && main.data?.tipo === tipo ? main.data : null;

  // Cargas secundarias independientes: su error se muestra en cada sección.
  const contentId = currentDetail?.album.contentId;
  const reviewLoader = useCallback(
    async () => {
      const result = contentId ? await reviewService.get(contentId) : null;
      return { contentId, review: result?.review ?? null };
    },
    [contentId],
  );
  const reviewResource = useResource(reviewLoader);

  const collectionsResource = useResource(collectionService.list);

  const [modal, setModal] = useState("");
  const modalOpener = useRef(null);
  const experienceSaves = useRef(new Map());
  const [pendingExperienceSaves, setPendingExperienceSaves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action, reload = main.reload) {
    setBusy(true);
    setError("");
    try {
      await action();
      setModal("");
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (!currentDetail)
    return <RequestState loading={main.loading || !main.error} error={main.error} />;

  const { album, item } = currentDetail;
  function updateExperience(field, value, save) {
    const key = JSON.stringify([id, tipo, field]);
    const pending = experienceSaves.current.get(key) ?? {
      confirmedValue: item[field],
      promise: Promise.resolve(),
    };
    const update = (nextValue) => {
      main.setData((data) => {
        if (data?.id !== id || data.tipo !== tipo || !data.item) return data;
        const updatedItem = { ...data.item, [field]: nextValue };
        return { ...data, item: updatedItem, album: updatedItem };
      });
    };

    setError("");
    update(value);
    setPendingExperienceSaves((count) => count + 1);

    const request = pending.promise.then(async () => {
      try {
        await save();
        pending.confirmedValue = value;
      } catch (e) {
        if (pending.promise === request) {
          update(pending.confirmedValue);
          setError(e.message);
        }
      } finally {
        if (pending.promise === request) experienceSaves.current.delete(key);
        setPendingExperienceSaves((count) => count - 1);
      }
    });
    pending.promise = request;
    experienceSaves.current.set(key, pending);
  }

  const currentReview =
    reviewResource.data?.contentId === contentId ? reviewResource.data : null;
  const review = currentReview?.review;
  const collections = collectionsResource.data ?? [];
  const saveToLibrary = () => run(() => libraryService.add(album));
  const libraryBusy = busy || main.loading || pendingExperienceSaves > 0;

  return (
    <div className="detail-page">
      <Link className="back-link" to="/explorar">
        ← Volver a explorar
      </Link>
      <RequestState error={error || main.error} />
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
              disabled={libraryBusy}
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
              disabled={libraryBusy || !item}
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
                disabled={libraryBusy}
                onClick={saveToLibrary}
              >
                Guardar en biblioteca
              </button>
            </div>
          )}
          <fieldset
            className="experience-controls"
            aria-label="Estado y puntuación"
            disabled={busy || main.loading || !item}
          >
            <label>
              Estado
              <select
                value={item?.estado || "quiero_escuchar"}
                onChange={(e) => {
                  const value = e.target.value;
                  updateExperience("estado", value, () =>
                    libraryService.state(contentId, value),
                  );
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
                value={item?.puntuacion || 0}
                onChange={(value) => {
                  updateExperience("puntuacion", value, () =>
                    ratingService.set(contentId, value),
                  );
                }}
              />
              {item?.puntuacion && (
                <button
                  className="pill"
                  onClick={() =>
                    updateExperience("puntuacion", null, () =>
                      ratingService.clear(contentId),
                    )
                  }
                >
                  Quitar puntuación
                </button>
              )}
            </div>
          </fieldset>
          <section className="detail-review">
            <h3>Tu reseña</h3>
            <RequestState
              loading={!currentReview && !reviewResource.error}
              error={reviewResource.error}
            />
            {currentReview && (
              <>
                <p>{review?.texto || "Todavía no escribiste una reseña."}</p>
                <div className="detail-review-actions">
                  <button
                    className="pill"
                    disabled={busy || reviewResource.loading}
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
                      disabled={busy || reviewResource.loading}
                      onClick={() =>
                        run(
                          () => reviewService.remove(contentId),
                          reviewResource.reload,
                        )
                      }
                    >
                      Eliminar reseña
                    </button>
                  )}
                </div>
              </>
            )}
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
                run(
                  () => reviewService.save(contentId, text, Boolean(review)),
                  reviewResource.reload,
                );
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
                    run(
                      () => collectionService.addItem(c.id, contentId),
                      collectionsResource.reload,
                    )
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
