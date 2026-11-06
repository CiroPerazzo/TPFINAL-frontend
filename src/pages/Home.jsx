import { Link } from "react-router-dom";
import Cover from "../components/ui/Cover.jsx";
import AlbumGrid from "../components/music/AlbumGrid.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import PageTitle from "../components/ui/PageTitle.jsx";
import { albums } from "../data/music.js";

export default function Home() {
  return (
    <>
      <PageTitle
        title="Tu música tiene una historia"
        subtitle="Descubrí, guardá y reviví lo que escuchás."
      />
      <div className="home-feature">
        <section className="hero">
          <small>TU UNIVERSO MUSICAL</small>
          <h2>
            Todo lo que suena
            <br />
            con vos.
          </h2>
          <p>Un lugar para tus favoritos, descubrimientos y recuerdos.</p>
          <Link className="button primary" to="/explorar">
            Explorar música   →
          </Link>
          <Cover
            title="TU COLECCIÓN"
            artist="Una historia personal"
            color="#927672" 
          />
        </section>
        <section className="summary">
          <small>TU RESUMEN</small>
          <div>
            <b>12</b>
            <span>contenidos guardados</span>
          </div>
          <div>
            <b>5</b>
            <span>favoritos</span>
          </div>
          <Link to="/colecciones">3 colecciones　 →</Link>
        </section>
      </div>
      <section className="home-recent">
        <SectionTitle to="/biblioteca" action="Ver biblioteca →">
          Agregados recientemente
        </SectionTitle>
        <AlbumGrid albums={albums} />
      </section>
      <section className="home-activity">
        <SectionTitle to="/perfil">Tu actividad reciente</SectionTitle>
        <div className="activity-card">
          <span>♥</span>
          <div>
            <strong>Agregaste After Hours a tus favoritos</strong>
            <p>Hoy · Biblioteca</p>
          </div>
        </div>
      </section>
    </>
  );
}
