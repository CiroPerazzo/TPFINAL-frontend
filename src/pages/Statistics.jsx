import StatCard from "../components/statistics/StatCard.jsx";
import ActivityChart from "../components/statistics/ActivityChart.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";

export default function Statistics() {
  const colors = ["#a9e4b7", "#b8a8ef", "#f4b986", "#88afc2"];
  return (
    <>
      <PageTitle
        title="Tu año en música"
        subtitle="Una mirada a lo que guardaste, valoraste y descubriste."
      >
        <select aria-label="Año">
          <option>2026</option>
        </select>
      </PageTitle>
      <div className="stat-grid">
        {[
          ["EN TU BIBLIOTECA", "12"],
          ["FAVORITOS", "5"],
          ["ESCUCHADOS", "7"],
          ["PUNTUACIÓN PROMEDIO", "4,2"],
        ].map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>
      <div className="chart-grid">
        <section className="chart-card">
          <h2>Estados de tu biblioteca</h2>
          <div className="horizontal-bars">
            {[
              ["Escuchado", 7, 238],
              ["Escuchando", 3, 102],
              ["Quiero escuchar", 2, 68],
            ].map(([label, value, width], i) => (
              <div className="bar-row" key={label}>
                <span>{label}</span>
                <div className="bar-track">
                  <div style={{ width: `${(width / 280) * 100}%`, background: colors[i] }} />
                </div>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="chart-card">
          <h2>Géneros de tu biblioteca</h2>
          <div className="horizontal-bars genre-bars">
            {["Pop", "R&B", "Urbano", "Electrónica"].map((label, i) => (
              <div className="bar-row" key={label}>
                <span>{label}</span>
                <div
                  style={{ width: `${50 - i * 10}%`, background: colors[i] }}
                  className="genre-bar"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <ActivityChart />
    </>
  );
}
