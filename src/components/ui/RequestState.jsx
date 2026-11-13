export default function RequestState({ loading, error }) {
  return error ? (
    <p role="alert" className="form-message">
      {error}
    </p>
  ) : loading ? (
    <p role="status">Cargando…</p>
  ) : null;
}
