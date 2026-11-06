import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import { albums } from "../data/music.js";

export default function Explore() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState("Todos");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("relevancia");
  let results = albums.filter(
    (a) =>
      `${a.title} ${a.artist}`.toLowerCase().includes(query.toLowerCase()) &&
      (!genre || a.genre === genre),
  );
  if (tab === "Canciones") results = [];
  if (sort === "nombre")
    results = [...results].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageTitle
        title="Explorá música"
        subtitle="Buscá tu próximo favorito entre canciones y álbumes."
      />
      <label className="search-field explore-search">
        <span>⌕</span>
        <input
          placeholder="Buscar artistas, canciones o álbumes"
          aria-label="Buscar artistas, canciones o álbumes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="explore-controls">
        <Tabs
          items={["Todos", "Canciones", "Álbumes"]}
          value={tab}
          onChange={setTab}
        />
        <select
          aria-label="Ordenar resultados"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="relevancia">Ordenar: relevancia</option>
          <option value="nombre">Ordenar: nombre</option>
        </select>
      </div>
      <section className="explore-results">
        <SectionTitle
          action={genre ? "Quitar filtro ×" : "Ver más →"}
          onClick={() => {
            setGenre("");
            setTab("Todos");
            setQuery("");
          }}
        >
          Descubrí algo nuevo{genre ? ` · ${genre}` : ""}
        </SectionTitle>
        <AlbumGrid albums={results} />
      </section>
      <section className="genres-section">
        <SectionTitle>Explorar por estilo</SectionTitle>
        <div className="genre-grid">
          {[
            ["Pop alternativo", "Pop", "#b8a8ef"],
            ["Urbano", "Urbano", "#f4b986"],
            ["Indie", "Indie", "#7da38f"],
            ["Electrónica", "Electrónica", "#7295ab"],
          ].map(([label, value, color]) => (
            <button
              key={label}
              style={{ background: color }}
              onClick={() => {
                setGenre(value);
                setTab("Todos");
              }}
            >
              <strong>{label}</strong>
              <span>Explorar ↗</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
