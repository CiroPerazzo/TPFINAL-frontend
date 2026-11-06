
import { monthlyActivity } from "../../data/music.js";

const formatHours = (value) =>
  `${Number.isInteger(value) ? value : value.toFixed(1)} h`;

export default function ActivityChart() {
  const totalHours = monthlyActivity.reduce(
    (total, activity) => total + activity.hours,
    0
  );

  const maxHours = 80;
  const gridValues = [80, 60, 40, 20, 0];

  return (
    <section className="monthly-chart">
      <div className="monthly-chart-header">
        <div>
          <h2>Actividad por mes</h2>
          <p>Tiempo que pasaste escuchando música</p>
        </div>

        <div className="monthly-total">
          <span>Total acumulado</span>
          <strong>{formatHours(totalHours)}</strong>
        </div>
      </div>

      <div className="monthly-chart-content">
        <div className="monthly-y-axis">
          {gridValues.map((value) => (
            <span key={value}>{value} h</span>
          ))}
        </div>

        <div className="monthly-chart-area">
          <div className="monthly-grid-lines">
            {gridValues.map((value) => (
              <div
                className="monthly-grid-line"
                key={value}
              />
            ))}
          </div>

          <div className="monthly-bars">
            {monthlyActivity.map(({ month, hours }) => (
              <div className="monthly-bar-column" key={month}>
                <div
                  className="monthly-bar"
                  style={{
                    height: `${(hours / maxHours) * 100}%`,
                  }}
                  title={`${month}: ${formatHours(hours)}`}
                />

                <span className="monthly-bar-label">
                  {month.slice(0, 1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
