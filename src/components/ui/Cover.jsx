export default function Cover({ title, artist, color, image, className = "" }) {
  if (image) return <img className={`cover ${className}`} src={image} alt={title} style={{ objectFit: "cover" }} />;
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
