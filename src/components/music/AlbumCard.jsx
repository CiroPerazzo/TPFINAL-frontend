import { Link } from "react-router-dom";
import Cover from "../ui/Cover.jsx";

export default function AlbumCard({ album }) {
  return (
    <Link className="album-card" to={`/detalle/${album.id}`}>
      <Cover {...album} />
      <strong>{album.title}</strong>
      <span>{album.artist}</span>
    </Link>
  );
}
