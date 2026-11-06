import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "./Cover.jsx";

export default function AccessForm({ register = false }) {
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
