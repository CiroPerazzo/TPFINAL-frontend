export default function Stars({ value = 4, onChange }) {
  return (
    <div className="stars" aria-label={`Puntuación: ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`Puntuar con ${n} estrellas`}
          >
            {n <= value ? "★" : "☆"}
          </button>
        ) : (
          <span key={n}>{n <= value ? "★" : "☆"}</span>
        ),
      )}
    </div>
  );
}
