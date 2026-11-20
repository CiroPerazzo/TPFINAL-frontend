export default function RequestState({ loading, error, centerLoading = false }) {
  return error ? (
    <p role="alert" className="form-message">
      {error}
    </p>
  ) : loading ? (
    <p role="status" className={centerLoading ? "loading-centered" : undefined}>
      Cargando…
    </p>
  ) : null;
}
