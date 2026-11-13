import PageTitle from "../components/ui/PageTitle.jsx";
import StatCard from "../components/statistics/StatCard.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { statisticsService } from "../services/statisticsService.js";
import { states } from "../services/models.js";
export default function Statistics() {
  const { data, loading, error } = useResource(statisticsService.get);
  const total = data?.totales_por_tipo.reduce((n, x) => n + x.total, 0) || 0;
  return (
    <>
      <PageTitle
        title="Tu música en números"
        subtitle="Estadísticas de tu biblioteca y actividad de los últimos seis meses."
      />
      <RequestState {...{ loading, error }} />
      {data && (
        <>
          <div className="stat-grid">
            {[
              ["EN TU BIBLIOTECA", total],
              ["FAVORITOS", data.favoritos],
              [
                "ESCUCHADOS",
                data.distribucion_estados.find((s) => s.estado === "escuchado")
                  ?.total || 0,
              ],
              [
                "PUNTUACIÓN PROMEDIO",
                data.promedio_puntuaciones.promedio ?? "—",
              ],
              ["RESEÑAS", data.total_resenas],
              ["COLECCIONES", data.colecciones.length],
            ].map(([label, value]) => (
              <StatCard key={label} {...{ label, value }} />
            ))}
          </div>
          <div className="chart-grid">
            {[
              [
                "Estados de tu biblioteca",
                data.distribucion_estados.map((s) => [
                  states[s.estado],
                  s.total,
                ]),
              ],
              [
                "Géneros de tu biblioteca",
                data.generos_frecuentes.map((g) => [g.genero, g.total]),
              ],
              [
                "Actividad por mes",
                data.actividad_por_mes.map((m) => [m.mes, m.acciones]),
              ],
            ].map(([title, rows]) => (
              <section className="chart-card" key={title}>
                <h2>{title}</h2>
                {rows.length ? (
                  rows.map(([label, value]) => (
                    <div className="bar-row" key={label}>
                      <span>{label}</span>
                      <div className="bar-track">
                        <div
                          style={{
                            width: `${(value / Math.max(...rows.map((r) => r[1]), 1)) * 100}%`,
                            background: "#b8a8ef",
                          }}
                        />
                      </div>
                      <b>{value}</b>
                    </div>
                  ))
                ) : (
                  <p>Todavía no hay datos.</p>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}
