import { useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle.jsx";
import Modal from "../components/ui/Modal.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { collectionService as service } from "../services/collectionService.js";
import { detailUrl } from "../services/models.js";
export default function Collections() {
  const resource = useResource(service.list);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
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
      <PageTitle
        title="Tus colecciones"
        subtitle="Creá espacios para cada momento y cada sonido."
      >
        <button className="button primary" onClick={() => setModal(true)}>
          ＋ Nueva colección
        </button>
      </PageTitle>
      <RequestState
        loading={resource.loading || busy}
        error={error || resource.error}
      />
      <div className="collection-grid">
        {resource.data?.map((c) => (
          <button
            className="collection-card"
            key={c.id}
            disabled={busy}
            onClick={() =>
              run(async () => setSelected(await service.detail(c.id)))
            }
          >
            <h2>{c.nombre}</h2>
            <p>{c.descripcion}</p>
          </button>
        ))}
      </div>
      {!resource.loading && !resource.error && !resource.data?.length && (
        <p>Todavía no creaste colecciones.</p>
      )}
      {modal && (
        <Modal title="Nueva colección" onClose={() => setModal(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = new FormData(e.currentTarget).get("name");
              run(async () => {
                await service.create(name);
                setModal(false);
                resource.reload();
              });
            }}
          >
            <label>
              Nombre
              <input name="name" required maxLength={100} />
            </label>
            <button className="button primary" disabled={busy}>
              Crear colección
            </button>
            <RequestState error={error} />
          </form>
        </Modal>
      )}
      {selected && (
        <Modal
          title={selected.collection.nombre}
          onClose={() => setSelected(null)}
        >
          <RequestState error={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = new FormData(e.currentTarget).get("name");
              run(async () => {
                await service.update(selected.collection.id, name);
                setSelected(await service.detail(selected.collection.id));
                resource.reload();
              });
            }}
          >
            <label>
              Nombre
              <input
                name="name"
                defaultValue={selected.collection.nombre}
                required
              />
            </label>
            <button className="pill" disabled={busy}>
              Guardar nombre
            </button>
          </form>
          {selected.items.map((a) => (
            <div className="review-row" key={a.contenido_id}>
              <Link to={detailUrl(a)}>
                {a.titulo} · {a.artista}
              </Link>
              <button
                className="pill"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await service.removeItem(
                      selected.collection.id,
                      a.contenido_id,
                    );
                    setSelected(await service.detail(selected.collection.id));
                  })
                }
              >
                Quitar
              </button>
            </div>
          ))}
          {!selected.items.length && (
            <p>Tu colección está vacía. Agregá música desde su detalle.</p>
          )}
          <button
            className="pill"
            disabled={busy}
            onClick={() => {
              if (window.confirm("¿Eliminar esta colección?"))
                run(async () => {
                  await service.remove(selected.collection.id);
                  setSelected(null);
                  resource.reload();
                });
            }}
          >
            Eliminar colección
          </button>
        </Modal>
      )}
    </>
  );
}
