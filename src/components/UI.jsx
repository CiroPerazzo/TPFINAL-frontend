import { Link } from "react-router-dom";

export function Cover({ title, artist, color, className = "" }) {
  return (
    <div className={`cover ${className}`} style={{ "--cover-color": color }}>
      <div className="cover-inner">
        <span className="record" aria-hidden="true">
          ◒
        </span>
        <div className="cover-copy">
          <strong>{title}</strong>
          <span>{artist}</span>
        </div>
      </div>
    </div>
  );
}
export function AlbumCard({ album }) {
  return (
    <Link className="album-card" to={`/detalle/${album.id}`}>
      <Cover {...album} />
      <strong>{album.title}</strong>
      <span>{album.artist}</span>
    </Link>
  );
}
export function AlbumGrid({ albums }) {
  return albums.length ? (
    <div className="album-grid">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  ) : (
    <p className="empty">No encontramos música con esos filtros.</p>
  );
}
export function SectionTitle({ children, to, action = "Ver todo →", onClick }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {to ? (
        <Link to={to}>{action}</Link>
      ) : onClick ? (
        <button className="text-button" onClick={onClick}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
export function PageTitle({ title, subtitle, children }) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button
          key={item}
          className={`pill ${value === item ? "selected" : ""}`}
          onClick={() => onChange(item)}
          aria-pressed={value === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function Stars({ value = 4, onChange }) {
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
export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div className="section-title">
          <h2>{title}</h2>
          <button
            autoFocus
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
