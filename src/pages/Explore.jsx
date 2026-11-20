import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import { musicService } from "../services/musicService.js";
export default function Explore() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [tab, setTab] = useState("Todos");
  const [sort, setSort] = useState("relevancia");
  const [response, setResponse] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    setResponse(null);
    const timer = setTimeout(async () => {
      try {
        const items = await musicService.search(
          query.trim() || "pop",
          tab === "Canciones" ? "track" : tab === "álbumes" ? "album" : "both",
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setResponse({ query, tab, items });
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setResponse({
            query,
            tab,
            error: e.message || "No pudimos completar la búsqueda.",
          });
        }
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, tab]);
  const currentResponse =
    response?.query === query && response.tab === tab ? response : null;
  const loading = !currentResponse;
  const error = currentResponse?.error;
  const results = currentResponse?.items || [];
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
          onChange={(e) => {
            const val = e.target.value;
            setParams((prev) => {
              const next = new URLSearchParams(prev);
              if (val) {
                next.set("q", val);
              } else {
                next.delete("q");
              }
              return next;
            }, { replace: true });
          }}
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
      <RequestState loading={loading} error={error} centerLoading />
      {!query.trim() && !loading && !error && results.length > 0 && (
        <p>Descubrí canciones y álbumes de pop o buscá tu música favorita.</p>
      )}
      {!loading && !error && results.length > 0 && <AlbumGrid albums={sorted} />}
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
