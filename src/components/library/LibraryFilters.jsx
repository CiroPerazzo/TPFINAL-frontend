import Tabs from "../ui/Tabs.jsx";

export default function LibraryFilters({ tab, setTab, query, setQuery, sort, setSort }) {
  return (
    <>
<div className="library-tabs">
        <Tabs
          items={[
            "Todos",
            "Quiero escuchar",
            "Escuchando",
            "Escuchado",
            "Favoritos",
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>
      <div className="library-search search-field">
        <span>⌕</span>
        <input
          placeholder="Buscar en tu biblioteca"
          aria-label="Buscar en tu biblioteca"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Ordenar biblioteca"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recientes">Ordenar: recientes</option>
          <option value="nombre">Ordenar: nombre</option>
        </select>
      </div>
    </>
  );
}
