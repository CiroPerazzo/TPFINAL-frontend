import AlbumCard from "./AlbumCard.jsx";

export default function AlbumGrid({ albums }) {
  if (!albums.length) return null;

  return (
    <div className="album-grid">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
