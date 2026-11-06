export default function StatCard({ label, value }) {
  return (
    <section>
      <small>{label}</small>
      <b>{value}</b>
    </section>
  );
}
