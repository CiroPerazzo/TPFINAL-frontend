import { Link } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle.jsx";
import RequestState from "../components/ui/RequestState.jsx";
import useResource from "../hooks/useResource.js";
import { collectionService as service } from "../services/collectionService.js";

export default function Collections() {
  const resource = useResource(service.list);

  return (
    <>
      <PageTitle
        title="Tus colecciones"
        subtitle="Creá espacios para cada momento y cada sonido."
      >
        <Link className="button primary" to="nueva">
          ＋ Nueva colección
        </Link>
      </PageTitle>
      <RequestState loading={resource.loading} error={resource.error} />
      <div className="collection-grid">
        {resource.data?.map((collection) => (
          <Link className="collection-card collection-link" key={collection.id} to={String(collection.id)}>
            <h2>{collection.nombre}</h2>
            {collection.descripcion && <p>{collection.descripcion}</p>}
          </Link>
        ))}
      </div>
      {!resource.loading && !resource.error && !resource.data?.length && (
        <p>Todavía no creaste colecciones.</p>
      )}
    </>
  );
}
