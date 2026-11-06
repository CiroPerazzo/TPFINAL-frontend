export default function FavoriteButton({ album, favorites, setFavorites }) {
  return (
    <button
                  className="favorite-button"
                  aria-label={`${favorites.includes(album.id) ? "Quitar" : "Agregar"} ${album.title} ${favorites.includes(album.id) ? "de" : "a"} favoritos`}
                  onClick={() =>
                    setFavorites((prev) =>
                      prev.includes(album.id)
                        ? prev.filter((id) => id !== album.id)
                        : [...prev, album.id],
                    )
                  }
                >
                  {favorites.includes(album.id) ? "♥" : "♡"}
                </button>
  );
}
