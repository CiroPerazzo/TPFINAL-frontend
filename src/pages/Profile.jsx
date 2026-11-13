import { useState } from "react";
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
  const [modal, setModal] = useState(false);
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
          <p>{user.bio}</p>
          <span>{user.email}</span>
        </div>
        <button className="pill" onClick={() => setModal(true)}>
          Editar perfil
        </button>
        <button className="pill" disabled={busy} onClick={() => run(logout)}>
          Cerrar sesión
        </button>
      </section>
      <RequestState
        loading={resource.loading}
        error={error || resource.error}
      />
      <SectionTitle>Mis géneros favoritos</SectionTitle>
      <div className="tabs">
        {user.generos_preferidos?.map((g) => (
          <span className="pill" key={g}>
            {g}
          </span>
        ))}
      </div>
      <SectionTitle to="/biblioteca">Mis favoritos</SectionTitle>
      <AlbumGrid albums={(resource.data || []).filter((a) => a.es_favorito)} />
      {modal && (
        <Modal title="Editar perfil" onClose={() => setModal(false)}>
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
