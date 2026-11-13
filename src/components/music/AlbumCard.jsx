import { Link } from "react-router-dom";
import { detailUrl } from "../../services/models.js";
import Cover from "../ui/Cover.jsx";

export default function AlbumCard({ album }) {
  return (
    <Link className="album-card" to={detailUrl(album)}>
      <Cover {...album} />
      <strong>{album.title}</strong>
      <span>{album.artist}</span>
    </Link>
  );
}
