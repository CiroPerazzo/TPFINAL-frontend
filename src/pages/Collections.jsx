import { useState } from "react";
import { Link } from "react-router-dom";
import CollectionCard from "../components/collections/CollectionCard.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Modal from "../components/ui/Modal.jsx";
import { albums, collections as initialCollections } from "../data/music.js";

export default function Collections() {
  const [items, setItems] = useState(initialCollections);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
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
      <div className="collection-grid">
        {items.map((c) => (
          <CollectionCard key={c.id} collection={c} onSelect={setSelected} />
        ))}
      </div>
      <section className="collection-help">
        <h2>Organizá tu música como quieras</h2>
        <p>Agregá o quitá contenidos desde el detalle de cada colección.</p>
      </section>
      {modal && (
        <Modal title="Nueva colección" onClose={() => setModal(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const title = new FormData(e.currentTarget).get("title").trim();
              if (title) {
                setItems([
                  ...items,
                  {
                    id: crypto.randomUUID(),
                    title,
                    count: 0,
                    color: "#765b8d",
                  },
                ]);
                setModal(false);
              }
            }}
          >
            <label>
              Nombre de la colección
              <input
                name="title"
                placeholder="Mi colección"
                required
                maxLength={50}
              />
            </label>
            <button className="button primary">Crear colección</button>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          {selected.count ? (
            <div className="collection-options">
              {albums.slice(0, selected.count).map((a) => (
                <Link className="pill" key={a.id} to={`/detalle/${a.id}`}>
                  {a.title} · {a.artist}
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-collection">
              <p>Tu colección está vacía.</p>
              <Link className="button primary" to="/explorar">
                Añade tus canciones favoritas
              </Link>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
