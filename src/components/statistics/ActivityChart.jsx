import { monthlyActivity } from "../../data/music.js";

const formatNumber = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

export default function ActivityChart() {
  const totalDays = monthlyActivity.reduce((total, activity) => total + activity.days, 0);
  const totalHours = monthlyActivity.reduce((total, activity) => total + activity.hours, 0);

  return (
    <section className="monthly-chart">
      <h2>Actividad por mes</h2>
      <p>Días de uso y horas acumuladas en tu cuenta.</p>
      <table className="monthly-activity-table">
        <caption>Datos de demostración</caption>
        <thead>
          <tr>
            <th scope="col">Mes</th>
            <th scope="col">Días de uso</th>
            <th scope="col">Horas de uso</th>
          </tr>
        </thead>
        <tbody>
          {monthlyActivity.map(({ month, days, hours }) => (
            <tr key={month}>
              <th scope="row">{month}</th>
              <td>{days} días</td>
              <td>{formatNumber.format(hours)} h</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{totalDays} días</td>
            <td>{formatNumber.format(totalHours)} h</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
