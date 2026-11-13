import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import { musicService } from "../services/musicService.js";
export default function Explore() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState("Todos");
  const [sort, setSort] = useState("relevancia");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    setResults([]);
    setLoading(Boolean(query.trim()));
    const timer = setTimeout(async () => {
      try {
        const items = await musicService.search(
          query,
          tab === "Canciones" ? "track" : tab === "álbumes" ? "album" : "both",
          controller.signal,
        );
        if (!controller.signal.aborted) setResults(items);
      } catch (e) {
        if (!controller.signal.aborted) setError(e.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, tab]);
  const sorted =
    sort === "nombre"
      ? [...results].sort((a, b) => a.title.localeCompare(b.title))
      : results;
  return (
    <>
      <PageTitle
        title="Explorá música"
        subtitle="Buscá canciones y álbumes en Spotify."
      />
      <label className="search-field explore-search">
        <input
          aria-label="Buscar música"
          placeholder="Buscar artistas, canciones o álbumes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="explore-controls">
        <Tabs
          items={["Todos", "Canciones", "álbumes"]}
          value={tab}
          onChange={setTab}
        />
        <select
          aria-label="Ordenar resultados"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="relevancia">Relevancia</option>
          <option value="nombre">Nombre</option>
        </select>
      </div>
      <RequestState {...{ loading, error }} />
      <AlbumGrid albums={sorted} />
      {!loading && !error && !results.length && (
        <p className="empty">
          {query.trim()
            ? "No encontramos resultados."
            : "Escribí una búsqueda para descubrir música."}
        </p>
      )}
    </>
  );
}
