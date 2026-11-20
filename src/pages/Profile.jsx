import { useRef, useState } from "react";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import Modal from "../components/ui/Modal.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useAuth from "../hooks/useAuth.js";
import useResource from "../hooks/useResource.js";
import { authService } from "../services/authService.js";
import { libraryService } from "../services/libraryService.js";
export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const resource = useResource(libraryService.list);
  const favorites = (resource.data || []).filter((album) => album.es_favorito);
  const [modal, setModal] = useState(false);
  const modalOpener = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="profile-hero">
        <div className="avatar">{user.username[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <small>PERFIL PERSONAL</small>
          <h1>{user.username}</h1>
          <span>{user.email}</span>
          {user.bio && <p>{user.bio}</p>}
        </div>
        <div className="profile-actions">
          <button
            className="pill"
            onClick={(e) => {
              modalOpener.current = e.currentTarget;
              setModal(true);
            }}
          >
            Editar perfil
          </button>
          <button className="pill" disabled={busy} onClick={() => run(logout)}>
            Cerrar sesión
          </button>
        </div>
      </section>
      <RequestState error={error} />
      <section className="profile-genres">
        <SectionTitle>Mis géneros favoritos</SectionTitle>
        {user.generos_preferidos?.length ? (
          <div className="tabs">
            {user.generos_preferidos.map((genre) => (
              <span className="pill" key={genre}>{genre}</span>
            ))}
          </div>
        ) : (
          <p className="profile-empty">Todavía no elegiste géneros favoritos.</p>
        )}
      </section>
      <section className="profile-favorites">
        <SectionTitle to="/biblioteca" action="Ver biblioteca →">Mis favoritos</SectionTitle>
        <RequestState loading={resource.loading} error={resource.error} />
        {!resource.loading && !resource.error && resource.data && (
          favorites.length ? (
            <AlbumGrid albums={favorites} />
          ) : (
            <p className="profile-empty">Todavía no tenés favoritos.</p>
          )
        )}
      </section>
      {modal && (
        <Modal
          openerRef={modalOpener}
          title="Editar perfil"
          onClose={() => setModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              run(async () => {
                const { user } = await authService.update({
                  bio: form.get("bio"),
                  generos_preferidos: form
                    .get("genres")
                    .split(",")
                    .map((g) => g.trim())
                    .filter(Boolean),
                });
                setUser(user);
                setModal(false);
              });
            }}
          >
            <label>
              Biografía
              <textarea
                name="bio"
                defaultValue={user.bio || ""}
                maxLength={300}
              />
            </label>
            <label>
              Géneros separados por coma
              <input
                name="genres"
                defaultValue={user.generos_preferidos?.join(", ") || ""}
              />
            </label>
            <RequestState error={error} />
            <button className="button primary" disabled={busy}>
              Guardar cambios
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
