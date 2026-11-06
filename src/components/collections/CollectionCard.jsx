import Cover from "../ui/Cover.jsx";

export default function CollectionCard({ collection, onSelect }) {
  return (
    <article className="collection-card">
            <Cover
              title={collection.title.toUpperCase()}
              artist="TU COLECCIÓN"
              color={collection.color}
            />
            <h2>{collection.title}</h2>
            <p>{collection.count} canciones</p>
            <button className="text-button" onClick={() => onSelect(collection)}>
              Ver colección →
            </button>
          </article>
  );
}
