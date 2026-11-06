import { useState } from "react";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import Modal from "../components/ui/Modal.jsx";
import { albums } from "../data/music.js";

export default function Profile({ favorites }) {
  const [name, setName] = useState("Agustin Aiello");
  const [bio, setBio] = useState(
    "Música para todos los momentos. Siempre buscando algo nuevo.",
  );
  const [genres, setGenres] = useState(["Pop", "R&B", "Urbano", "Electrónica"]);
  const [modal, setModal] = useState("");
  return (
    <>
      <section className="profile-hero">
        <div className="avatar">{name[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <small>PERFIL PERSONAL</small>
          <h1>{name}</h1>
          <p>{bio}</p>
          <span>
            12 contenidos　·　{favorites.length} favoritos　·　3 colecciones
          </span>
        </div>
        <button className="pill" onClick={() => setModal("profile")}>
          Editar perfil
        </button>
      </section>
      <section className="profile-genres">
        <SectionTitle
          action="Editar preferencias"
          onClick={() => setModal("genres")}
        >
          Mis géneros favoritos
        </SectionTitle>
        <div className="tabs">
          {genres.map((g) => (
            <span className="pill" key={g}>
              {g}
            </span>
          ))}
        </div>
      </section>
      <section className="profile-favorites">
        <SectionTitle to="/biblioteca" action="Ver todos →">
          Mis favoritos
        </SectionTitle>
        <AlbumGrid albums={albums.filter((a) => favorites.includes(a.id))} />
      </section>
      <section className="profile-activity">
        <SectionTitle to="/estadisticas">Actividad reciente</SectionTitle>
        <p>♥ Agregaste After Hours a favoritos · Hoy</p>
      </section>
      {modal && (
        <Modal
          title={modal === "profile" ? "Editar perfil" : "Editar preferencias"}
          onClose={() => setModal("")}
        >
          {modal === "profile" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                setName(data.get("name"));
                setBio(data.get("bio"));
                setModal("");
              }}
            >
              <label>
                Nombre
                <input
                  name="name"
                  defaultValue={name}
                  required
                  maxLength={30}
                />
              </label>
              <label>
                Biografía
                <textarea name="bio" defaultValue={bio} maxLength={150} />
              </label>
              <button className="button primary">Guardar cambios</button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGenres(new FormData(e.currentTarget).getAll("genre"));
                setModal("");
              }}
            >
              {["Pop", "R&B", "Urbano", "Electrónica", "Indie", "Rock"].map(
                (g) => (
                  <label className="checkbox-label" key={g}>
                    <input
                      type="checkbox"
                      name="genre"
                      value={g}
                      defaultChecked={genres.includes(g)}
                    />
                    {g}
                  </label>
                ),
              )}
              <button className="button primary">Guardar preferencias</button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
