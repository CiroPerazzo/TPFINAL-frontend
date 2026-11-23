# MUSICMAN — Frontend

Frontend del Trabajo Práctico Final de DAI / EFSI. La aplicación permite explorar canciones y álbumes, administrar una biblioteca personal, marcar favoritos, puntuar, escribir reseñas, crear colecciones y consultar estadísticas.

## Tecnologías

- React
- React Router
- Vite
- Axios

## Instalación local

Necesitás Node.js 22.12 o superior de la serie 22, o Node.js 24, y npm. También tiene que estar iniciado el backend y configurada la base de datos.

Cloná el repositorio e instalá las dependencias:

```bash
git clone https://github.com/CiroPerazzo/TPFINAL-frontend.git
cd TPFINAL-frontend
npm install
```

Copiá `.env.example` como `.env`. Para desarrollo local, los valores predeterminados usan el proxy de Vite hacia `http://localhost:3000`.

Iniciá el frontend:

```bash
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173).

## Variables de entorno

| Variable | Valor predeterminado | Uso |
|---|---|---|
| `VITE_API_URL` | `/api` | URL base de las peticiones a la API. |
| `API_PROXY_TARGET` | `http://localhost:3000` | Dirección del backend para el proxy de Vite. |

Las credenciales de PostgreSQL, JWT y Spotify se configuran en el backend, no en el frontend.

## Comandos

| Comando | Función |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Permite probar localmente el build. |

## Prueba manual

1. Registrate e iniciá sesión. Recargá una pantalla privada para comprobar que la sesión se mantiene.
2. Buscá una canción o álbum y abrí su detalle.
3. Agregalo a la biblioteca, cambiá su estado, marcá favorito, asigná una puntuación y escribí una reseña.
4. Creá una colección y agregale el contenido.
5. Revisá las pantallas de Inicio y Estadísticas.

## Despliegue

Para publicar el frontend, ejecutá `npm run build` y desplegá el contenido de `dist/`. Si frontend y backend están en dominios distintos, configurá `VITE_API_URL` con la URL pública de la API antes de compilar y `FRONTEND_URL` en el backend con el origen del frontend. En producción se debe usar HTTPS para las cookies de sesión.

## Documentación

La [guía técnica del frontend](docs/frontend.md) contiene más detalles sobre las pantallas, los servicios y la integración con el backend.
