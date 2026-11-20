export default function Stars({ value = 4, onChange }) {
  return (
    <div className="stars" aria-label={`Puntuación: ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Puntuar con ${n} ${n === 1 ? "estrella" : "estrellas"}`}
            aria-pressed={n === value}
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
