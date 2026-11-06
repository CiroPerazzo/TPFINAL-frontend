import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cover from "../components/ui/Cover.jsx";
import Stars from "../components/ui/Stars.jsx";
import Modal from "../components/ui/Modal.jsx";
import { albums, collections as initialCollections } from "../data/music.js";

export default function Detail({ favorites, setFavorites }) {
  const { id } = useParams();
  const album = albums.find((a) => a.id === id) || albums[0];
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState(
    "Una de mis producciones favoritas. Me encanta su atmósfera.",
  );
  const [modal, setModal] = useState("");
  return (
    <div className="detail-page">
      <Link className="back-link" to="/explorar">
        ← Volver a explorar
      </Link>
      <div className="album-detail">
        <Cover {...album} artist={album.artist.toUpperCase()} />
        <div className="album-info">
          <small>ÁLBUM · {album.year}</small>
          <h1>{album.id === "after-hours" ? "After Hours" : album.title}</h1>
          <p>
            {album.artist} · {album.tracks} canciones
          </p>
          <div className="tabs">
            <span className="pill">{album.genre}</span>
            <span className="pill">R&B</span>
          </div>
          <div className="detail-actions">
            <button className="button primary" onClick={() => setSaved(!saved)}>
              {saved ? "✓ Guardado en biblioteca" : "＋ Guardar en biblioteca"}
            </button>
            <button
              className="pill"
              onClick={() =>
                setFavorites((prev) =>
                  prev.includes(album.id)
                    ? prev.filter((x) => x !== album.id)
                    : [...prev, album.id],
                )
              }
            >
              {favorites.includes(album.id) ? "♥" : "♡"} Favorito
            </button>
            <button className="pill" onClick={() => setModal("collection")}>
              ＋ Colección
            </button>
          </div>
        </div>
      </div>
      <section className="about-album">
        <h2>Sobre este álbum</h2>
        <p>
          Un álbum de pop y R&B que combina sonidos nocturnos, sintetizadores y
          una atmósfera cinematográfica.
        </p>
      </section>
      <section className="experience">
        <h2>Tu experiencia</h2>
        <div className="experience-card">
          <div className="experience-controls">
            <label>
              Estado
              <select defaultValue={album.status}>
                <option>Escuchado</option>
                <option>Escuchando</option>
                <option>Quiero escuchar</option>
              </select>
            </label>
            <div>
              <span>Tu puntuación</span>
              <Stars value={rating} onChange={setRating} />
            </div>
          </div>
          <strong>Tu reseña</strong>
          <div className="review-row">
            <p>{review}</p>
            <button className="pill" onClick={() => setModal("review")}>
              Editar reseña
            </button>
          </div>
        </div>
      </section>
      {modal && (
        <Modal
          title={
            modal === "review" ? "Editar reseña" : "Agregar a una colección"
          }
          onClose={() => setModal("")}
        >
          {modal === "review" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setReview(new FormData(e.currentTarget).get("review"));
                setModal("");
              }}
            >
              <label>
                Tu reseña
                <textarea name="review" defaultValue={review} required />
              </label>
              <button className="button primary">Guardar reseña</button>
            </form>
          ) : (
            <div className="collection-options">
              {initialCollections.map((c) => (
                <button
                  key={c.id}
                  className="pill"
                  onClick={() => setModal("")}
                >
                  {c.title} ＋
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
