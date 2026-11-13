import { Link } from "react-router-dom";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { libraryService } from "../services/libraryService.js";
import { statisticsService } from "../services/statisticsService.js";
const load = async () => {
  const [items, stats, activity] = await Promise.all([
    libraryService.list(),
    statisticsService.get(),
    statisticsService.activity(),
  ]);
  return { items, stats, activity };
};
export default function Home() {
  const { data, loading, error } = useResource(load);
  return (
    <>
      <PageTitle
        title="Tu música tiene una historia"
        subtitle="Descubrí, guardá y reviví lo que escuchás."
      />
      <div className="home-feature">
        <section className="hero">
          <small>TU UNIVERSO MUSICAL</small>
          <h2>
            Todo lo que suena
            <br />
            con vos.
          </h2>
          <p>Un lugar para tus favoritos, descubrimientos y recuerdos.</p>
          <Link className="button primary" to="/explorar">
            Explorar música →
          </Link>
        </section>
        {data && (
          <section className="summary">
            <small>TU RESUMEN</small>
            <div className="summary-stat">
              <b>{data.items.length}</b>
              <span>contenidos guardados</span>
            </div>
            <div className="summary-stat">
              <b>{data.stats.favoritos}</b>
              <span>favoritos</span>
            </div>
            <Link to="/colecciones">
              {data.stats.colecciones.length} colecciones →
            </Link>
          </section>
        )}
      </div>
      <RequestState {...{ loading, error }} />
      {data && (
        <>
          <SectionTitle to="/biblioteca" action="Ver biblioteca →">
            Agregados recientemente
          </SectionTitle>
          <AlbumGrid albums={data.items.slice(0, 8)} />
          {!data.items.length && (
            <p>Tu biblioteca está vacía. Explorá música para empezar.</p>
          )}
          <SectionTitle>Tu actividad reciente</SectionTitle>
          {data.activity.slice(0, 5).map((a) => (
            <div className="activity-card" key={a.id}>
              <span>{a.tipo.replaceAll("_", " ")}</span>
              <time>{new Date(a.creado_en).toLocaleString("es-AR")}</time>
            </div>
          ))}
        </>
      )}
    </>
  );
}
