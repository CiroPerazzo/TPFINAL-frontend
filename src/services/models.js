export const states = {
  quiero_escuchar: "Quiero escuchar",
  escuchando: "Escuchando",
  escuchado: "Escuchado",
};
export function music(item) {
  return {
    ...item,
    id: item.spotify_id,
    contentId: item.contenido_id ?? item.id,
    title: item.titulo,
    artist: item.artista || "",
    image: item.portada_url,
    year: item.fecha_lanzamiento?.slice(0, 4),
    tracks: item.total_canciones,
    genre: (item.generos || []).join(", "),
    status: states[item.estado],
    color: "#765b8d",
  };
}
export const detailUrl = (item) =>
  `/detalle/${item.spotify_id || item.id}?tipo=${item.tipo || "album"}`;
