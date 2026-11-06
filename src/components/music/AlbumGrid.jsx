import AlbumCard from "./AlbumCard.jsx";

export default function AlbumGrid({ albums }) {
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
