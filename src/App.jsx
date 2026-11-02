import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import {
  Cover,
  AlbumGrid,
  SectionTitle,
  PageTitle,
  Tabs,
  Stars,
  Modal,
} from "./components/UI.jsx";
import { albums, collections as initialCollections } from "./data/music.js";

function Home() {
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
            Explorar música →
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
function Explore() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState("Todos");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("relevancia");
  let results = albums.filter(
    (a) =>
      `${a.title} ${a.artist}`.toLowerCase().includes(query.toLowerCase()) &&
      (!genre || a.genre === genre),
  );
  if (tab === "Canciones") results = [];
  if (sort === "nombre")
    results = [...results].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageTitle
        title="Explorá música"
        subtitle="Buscá tu próximo favorito entre canciones y álbumes."
      />
      <label className="search-field explore-search">
        <span>⌕</span>
        <input
          placeholder="Buscar artistas, canciones o álbumes"
          aria-label="Buscar artistas, canciones o álbumes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="explore-controls">
        <Tabs
          items={["Todos", "Canciones", "Álbumes"]}
          value={tab}
          onChange={setTab}
        />
        <select
          aria-label="Ordenar resultados"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="relevancia">Ordenar: relevancia</option>
          <option value="nombre">Ordenar: nombre</option>
        </select>
      </div>
      <section className="explore-results">
        <SectionTitle
          action={genre ? "Quitar filtro ×" : "Ver más →"}
          onClick={() => {
            setGenre("");
            setTab("Todos");
            setQuery("");
          }}
        >
          Descubrí algo nuevo{genre ? ` · ${genre}` : ""}
        </SectionTitle>
        <AlbumGrid albums={results} />
      </section>
      <section className="genres-section">
        <SectionTitle>Explorar por estilo</SectionTitle>
        <div className="genre-grid">
          {[
            ["Pop alternativo", "Pop", "#b8a8ef"],
            ["Urbano", "Urbano", "#f4b986"],
            ["Indie", "Indie", "#7da38f"],
            ["Electrónica", "Electrónica", "#7295ab"],
          ].map(([label, value, color]) => (
            <button
              key={label}
              style={{ background: color }}
              onClick={() => {
                setGenre(value);
                setTab("Todos");
              }}
            >
              <strong>{label}</strong>
              <span>Explorar ↗</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
function Library({ favorites, setFavorites }) {
  const [tab, setTab] = useState("Todos  12");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recientes");
  const results = albums.filter(
    (a) =>
      `${a.title} ${a.artist}`.toLowerCase().includes(query.toLowerCase()) &&
      (tab.startsWith("Todos") ||
        (tab.startsWith("Favoritos")
          ? favorites.includes(a.id)
          : a.status === tab)),
  );
  if (sort === "nombre") results.sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageTitle
        title="Tu biblioteca"
        subtitle="Tu música guardada, organizada a tu manera."
      >
        <Link className="button primary" to="/explorar">
          ＋ Agregar música
        </Link>
      </PageTitle>
      <div className="library-tabs">
        <Tabs
          items={[
            "Todos  12",
            "Quiero escuchar",
            "Escuchando",
            "Escuchado",
            "Favoritos  5",
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>
      <div className="library-search search-field">
        <span>⌕</span>
        <input
          placeholder="Buscar en tu biblioteca"
          aria-label="Buscar en tu biblioteca"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Ordenar biblioteca"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recientes">Ordenar: recientes</option>
          <option value="nombre">Ordenar: nombre</option>
        </select>
      </div>
      <table className="library-table">
        <thead>
          <tr>
            <th>CONTENIDO</th>
            <th>ESTADO</th>
            <th>PUNTUACIÓN</th>
            <th>FAVORITO</th>
          </tr>
        </thead>
        <tbody>
          {results.map((a) => (
            <tr key={a.id}>
              <td>
                <Link className="library-album" to={`/detalle/${a.id}`}>
                  <Cover {...a} className="mini-cover" />
                  <div>
                    <strong>{a.title}</strong>
                    <span>{a.artist}</span>
                  </div>
                </Link>
              </td>
              <td>
                <span className="pill status">{a.status}</span>
              </td>
              <td>
                <Stars />
              </td>
              <td>
                <button
                  className="favorite-button"
                  aria-label={`${favorites.includes(a.id) ? "Quitar" : "Agregar"} ${a.title} ${favorites.includes(a.id) ? "de" : "a"} favoritos`}
                  onClick={() =>
                    setFavorites((prev) =>
                      prev.includes(a.id)
                        ? prev.filter((id) => id !== a.id)
                        : [...prev, a.id],
                    )
                  }
                >
                  {favorites.includes(a.id) ? "♥" : "♡"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!results.length && (
        <p className="empty">No encontramos música con esos filtros.</p>
      )}
    </>
  );
}
function Detail({ favorites, setFavorites }) {
  const { id } = useParams();
  const album = albums.find((a) => a.id === id) || albums[0];
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState(
    "Una de mis producciones favoritas. Me encanta su atmósfera.",
  );
  const [modal, setModal] = useState("");
  return (
    <div className="detail-page">
      <Link className="back-link" to="/explorar">
        ← Volver a explorar
      </Link>
      <div className="album-detail">
        <Cover {...album} artist={album.artist.toUpperCase()} />
        <div className="album-info">
          <small>ÁLBUM · {album.year}</small>
          <h1>{album.id === "after-hours" ? "After Hours" : album.title}</h1>
          <p>
            {album.artist} · {album.tracks} canciones
          </p>
          <div className="tabs">
            <span className="pill">{album.genre}</span>
            <span className="pill">R&B</span>
          </div>
          <div className="detail-actions">
            <button className="button primary" onClick={() => setSaved(!saved)}>
              {saved ? "✓ Guardado en biblioteca" : "＋ Guardar en biblioteca"}
            </button>
            <button
              className="pill"
              onClick={() =>
                setFavorites((prev) =>
                  prev.includes(album.id)
                    ? prev.filter((x) => x !== album.id)
                    : [...prev, album.id],
                )
              }
            >
              {favorites.includes(album.id) ? "♥" : "♡"} Favorito
            </button>
            <button className="pill" onClick={() => setModal("collection")}>
              ＋ Colección
            </button>
          </div>
        </div>
      </div>
      <section className="about-album">
        <h2>Sobre este álbum</h2>
        <p>
          Un álbum de pop y R&B que combina sonidos nocturnos, sintetizadores y
          una atmósfera cinematográfica.
        </p>
      </section>
      <section className="experience">
        <h2>Tu experiencia</h2>
        <div className="experience-card">
          <div className="experience-controls">
            <label>
              Estado
              <select defaultValue={album.status}>
                <option>Escuchado</option>
                <option>Escuchando</option>
                <option>Quiero escuchar</option>
              </select>
            </label>
            <div>
              <span>Tu puntuación</span>
              <Stars value={rating} onChange={setRating} />
            </div>
          </div>
          <strong>Tu reseña</strong>
          <div className="review-row">
            <p>{review}</p>
            <button className="pill" onClick={() => setModal("review")}>
              Editar reseña
            </button>
          </div>
        </div>
      </section>
      {modal && (
        <Modal
          title={
            modal === "review" ? "Editar reseña" : "Agregar a una colección"
          }
          onClose={() => setModal("")}
        >
          {modal === "review" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setReview(new FormData(e.currentTarget).get("review"));
                setModal("");
              }}
            >
              <label>
                Tu reseña
                <textarea name="review" defaultValue={review} required />
              </label>
              <button className="button primary">Guardar reseña</button>
            </form>
          ) : (
            <div className="collection-options">
              {initialCollections.map((c) => (
                <button
                  key={c.id}
                  className="pill"
                  onClick={() => setModal("")}
                >
                  {c.title} ＋
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
function Collections() {
  const [items, setItems] = useState(initialCollections);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  return (
    <>
      <PageTitle
        title="Tus colecciones"
        subtitle="Creá espacios para cada momento y cada sonido."
      >
        <button className="button primary" onClick={() => setModal(true)}>
          ＋ Nueva colección
        </button>
      </PageTitle>
      <div className="collection-grid">
        {items.map((c) => (
          <article className="collection-card" key={c.id}>
            <Cover
              title={c.title.toUpperCase()}
              artist="TU COLECCIÓN"
              color={c.color}
            />
            <h2>{c.title}</h2>
            <p>{c.count} canciones</p>
            <button className="text-button" onClick={() => setSelected(c)}>
              Ver colección →
            </button>
          </article>
        ))}
      </div>
      <section className="collection-help">
        <h2>Organizá tu música como quieras</h2>
        <p>Agregá o quitá contenidos desde el detalle de cada colección.</p>
      </section>
      {modal && (
        <Modal title="Nueva colección" onClose={() => setModal(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const title = new FormData(e.currentTarget).get("title").trim();
              if (title) {
                setItems([
                  ...items,
                  {
                    id: crypto.randomUUID(),
                    title,
                    count: 0,
                    color: "#765b8d",
                  },
                ]);
                setModal(false);
              }
            }}
          >
            <label>
              Nombre de la colección
              <input
                name="title"
                placeholder="Mi colección"
                required
                maxLength={50}
              />
            </label>
            <button className="button primary">Crear colección</button>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          {selected.count ? (
            <div className="collection-options">
              {albums.slice(0, selected.count).map((a) => (
                <Link className="pill" key={a.id} to={`/detalle/${a.id}`}>
                  {a.title} · {a.artist}
                </Link>
              ))}
            </div>
          ) : (
            <p>
              Tu colección está vacía. Agregá música desde el detalle de un
              álbum.
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
function Profile({ favorites }) {
  const [name, setName] = useState("Ciro");
  const [bio, setBio] = useState(
    "Música para todos los momentos. Siempre buscando algo nuevo.",
  );
  const [genres, setGenres] = useState(["Pop", "R&B", "Urbano", "Electrónica"]);
  const [modal, setModal] = useState("");
  return (
    <>
      <section className="profile-hero">
        <div className="avatar">{name[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <small>PERFIL PERSONAL</small>
          <h1>{name}</h1>
          <p>{bio}</p>
          <span>
            12 contenidos　·　{favorites.length} favoritos　·　3 colecciones
          </span>
        </div>
        <button className="pill" onClick={() => setModal("profile")}>
          Editar perfil
        </button>
      </section>
      <section className="profile-genres">
        <SectionTitle
          action="Editar preferencias"
          onClick={() => setModal("genres")}
        >
          Mis géneros favoritos
        </SectionTitle>
        <div className="tabs">
          {genres.map((g) => (
            <span className="pill" key={g}>
              {g}
            </span>
          ))}
        </div>
      </section>
      <section className="profile-favorites">
        <SectionTitle to="/biblioteca" action="Ver todos →">
          Mis favoritos
        </SectionTitle>
        <AlbumGrid albums={albums.filter((a) => favorites.includes(a.id))} />
      </section>
      <section className="profile-activity">
        <SectionTitle to="/estadisticas">Actividad reciente</SectionTitle>
        <p>♥ Agregaste After Hours a favoritos · Hoy</p>
      </section>
      {modal && (
        <Modal
          title={modal === "profile" ? "Editar perfil" : "Editar preferencias"}
          onClose={() => setModal("")}
        >
          {modal === "profile" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                setName(data.get("name"));
                setBio(data.get("bio"));
                setModal("");
              }}
            >
              <label>
                Nombre
                <input
                  name="name"
                  defaultValue={name}
                  required
                  maxLength={30}
                />
              </label>
              <label>
                Biografía
                <textarea name="bio" defaultValue={bio} maxLength={150} />
              </label>
              <button className="button primary">Guardar cambios</button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGenres(new FormData(e.currentTarget).getAll("genre"));
                setModal("");
              }}
            >
              {["Pop", "R&B", "Urbano", "Electrónica", "Indie", "Rock"].map(
                (g) => (
                  <label className="checkbox-label" key={g}>
                    <input
                      type="checkbox"
                      name="genre"
                      value={g}
                      defaultChecked={genres.includes(g)}
                    />
                    {g}
                  </label>
                ),
              )}
              <button className="button primary">Guardar preferencias</button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
function Statistics() {
  const colors = ["#a9e4b7", "#b8a8ef", "#f4b986", "#88afc2"];
  return (
    <>
      <PageTitle
        title="Tu año en música"
        subtitle="Una mirada a lo que guardaste, valoraste y descubriste."
      >
        <select aria-label="Año">
          <option>2026</option>
        </select>
      </PageTitle>
      <div className="stat-grid">
        {[
          ["EN TU BIBLIOTECA", "12"],
          ["FAVORITOS", "5"],
          ["ESCUCHADOS", "7"],
          ["PUNTUACIÓN PROMEDIO", "4,2"],
        ].map(([label, value]) => (
          <section key={label}>
            <small>{label}</small>
            <b>{value}</b>
          </section>
        ))}
      </div>
      <div className="chart-grid">
        <section className="chart-card">
          <h2>Estados de tu biblioteca</h2>
          <div className="horizontal-bars">
            {[
              ["Escuchado", 7, 238],
              ["Escuchando", 3, 102],
              ["Quiero escuchar", 2, 68],
            ].map(([label, value, width], i) => (
              <div className="bar-row" key={label}>
                <span>{label}</span>
                <div className="bar-track">
                  <div style={{ width, background: colors[i] }} />
                </div>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="chart-card">
          <h2>Géneros de tu biblioteca</h2>
          <div className="horizontal-bars genre-bars">
            {["Pop", "R&B", "Urbano", "Electrónica"].map((label, i) => (
              <div className="bar-row" key={label}>
                <span>{label}</span>
                <div
                  style={{ width: 230 - i * 46, background: colors[i] }}
                  className="genre-bar"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="monthly-chart">
        <h2>Actividad por mes</h2>
        <p>Acciones registradas en tu cuenta</p>
        <div
          className="monthly-bars"
          role="img"
          aria-label="Actividad mensual de enero a diciembre: 44, 70, 52, 90, 67, 112, 86, 130, 95, 140, 100 y 120"
        >
          <div className="monthly-columns">
            {[44, 70, 52, 90, 67, 112, 86, 130, 95, 140, 100, 120].map(
              (height, i) => (
                <div
                  key={i}
                  style={{ height }}
                  title={`${["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][i]}: ${height}`}
                />
              ),
            )}
          </div>
          <div className="month-labels">
            {"EFMAMJJASOND".split("").map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
function Access({ register = false }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  return (
    <div className={`access-page ${register ? "register" : "login"}`}>
      <section className="access-story">
        <Link className="access-brand" to="/">
          ◒ SONORA
        </Link>
        <h1>
          {register ? (
            <>
              Tu colección
              <br />
              empieza acá.
            </>
          ) : (
            <>
              Cada canción
              <br />
              tiene un lugar.
            </>
          )}
        </h1>
        <p>
          {register
            ? "Descubrí, organizá y valorá la música que te acompaña."
            : "Guardá tus descubrimientos, organizá tu música y conocé tu historia."}
        </p>
        <div className="access-covers">
          <Cover
            title={register ? "TU MÚSICA" : "TU UNIVERSO"}
            artist="SONORA"
            color={register ? "#7b6b98" : "#8d6e71"}
          />
          {!register && (
            <Cover title="TU HISTORIA" artist="SONORA" color="#6b8490" />
          )}
        </div>
      </section>
      <section className="access-form">
        <h1>{register ? "Crear una cuenta" : "Bienvenido de nuevo"}</h1>
        <p>
          {register
            ? "Empezá a construir tu historia musical."
            : "Ingresá para volver a tu colección."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            if (register && data.get("password") !== data.get("confirm")) {
              setError("Las contraseñas no coinciden.");
              return;
            }
            setError(
              "Vista de demostración: la autenticación se conectará al backend.",
            );
          }}
        >
          {register && (
            <label>
              Nombre de usuario
              <input
                name="name"
                placeholder="Tu nombre"
                autoComplete="username"
                required
              />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              name="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete={register ? "new-password" : "current-password"}
              required
            />
          </label>
          {register && (
            <label>
              Confirmar contraseña
              <input
                name="confirm"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </label>
          )}
          <button className="button primary" type="submit">
            {register ? "Crear cuenta" : "Iniciar sesión"}
          </button>
          {error && (
            <p className="form-message" role="status">
              {error}{" "}
              {error.startsWith("Vista") && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => navigate("/")}
                >
                  Ver colección →
                </button>
              )}
            </p>
          )}
        </form>
        <p className="access-switch">
          {register ? "¿Ya tenés cuenta?" : "¿Todavía no tenés cuenta?"}　
          <Link to={register ? "/login" : "/registro"}>
            {register ? "Iniciá sesión" : "Registrate"}
          </Link>
        </p>
      </section>
    </div>
  );
}
export default function App() {
  const [favorites, setFavorites] = useState(
    albums.filter((a) => a.favorite).map((a) => a.id),
  );
  return (
    <Routes>
      <Route path="/login" element={<Access key="login" />} />
      <Route path="/registro" element={<Access key="register" register />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explorar" element={<Explore />} />
        <Route
          path="biblioteca"
          element={
            <Library favorites={favorites} setFavorites={setFavorites} />
          }
        />
        <Route
          path="detalle/:id"
          element={<Detail favorites={favorites} setFavorites={setFavorites} />}
        />
        <Route path="colecciones" element={<Collections />} />
        <Route path="perfil" element={<Profile favorites={favorites} />} />
        <Route path="estadisticas" element={<Statistics />} />
        <Route
          path="*"
          element={
            <>
              <PageTitle
                title="Página no encontrada"
                subtitle="Volvé a tu espacio musical."
              />
              <Link className="button primary" to="/">
                Ir al inicio
              </Link>
            </>
          }
        />
      </Route>
    </Routes>
  );
}
