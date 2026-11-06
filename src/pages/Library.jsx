import { useState } from "react";
import { Link } from "react-router-dom";
import Cover from "../components/ui/Cover.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import LibraryFilters from "../components/library/LibraryFilters.jsx";
import FavoriteButton from "../components/library/FavoriteButton.jsx";
import Stars from "../components/ui/Stars.jsx";
import { albums } from "../data/music.js";

export default function Library({ favorites, setFavorites }) {
  const [tab, setTab] = useState("Todos  12");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recientes");
  const results = albums.filter(
    (a) =>
      `${a.title} ${a.artist}`.toLowerCase().includes(query.toLowerCase()) &&
      (tab.startsWith("Todos") ||
        (tab.startsWith("Favoritos")
          ? favorites.includes(a.id)
          : a.status === tab)),
  );
  if (sort === "nombre") results.sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageTitle
        title="Tu biblioteca"
        subtitle="Tu música guardada, organizada a tu manera."
      >
        <Link className="button primary" to="/explorar">
          ＋ Agregar música
        </Link>
      </PageTitle>
      <LibraryFilters tab={tab} setTab={setTab} query={query} setQuery={setQuery} sort={sort} setSort={setSort} />
      <table className="library-table">
        <thead>
          <tr>
            <th>CONTENIDO</th>
            <th>ESTADO</th>
            <th>PUNTUACIÓN</th>
            <th>FAVORITO</th>
          </tr>
        </thead>
        <tbody>
          {results.map((a) => (
            <tr key={a.id}>
              <td>
                <Link className="library-album" to={`/detalle/${a.id}`}>
                  <Cover {...a} className="mini-cover" />
                  <div>
                    <strong>{a.title}</strong>
                    <span>{a.artist}</span>
                  </div>
                </Link>
              </td>
              <td>
                <span className="pill status">{a.status}</span>
              </td>
              <td>
                <Stars />
              </td>
              <td>
                <FavoriteButton album={a} favorites={favorites} setFavorites={setFavorites} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!results.length && (
        <p className="empty">No encontramos música con esos filtros.</p>
      )}
    </>
  );
}
