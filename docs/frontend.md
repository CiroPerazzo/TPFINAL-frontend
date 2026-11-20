# Guía técnica del frontend

## Estructura

| Ubicación | Responsabilidad |
| --- | --- |
| `src/main.jsx` | Monta React con `BrowserRouter` y `AuthProvider`. |
| `src/App.jsx` y `src/routes/` | Declaran las rutas y protegen las pantallas de la cuenta. |
| `src/pages/` | Coordinan datos, estados de carga, formularios y acciones por pantalla. |
| `src/components/` | Contienen el layout, los componentes de música, estadísticas, biblioteca, colecciones y los controles reutilizables. |
| `src/context/` y `src/hooks/` | Comparten la sesión y el ciclo de carga de recursos. |
| `src/services/` | Agrupan las llamadas a la API por dominio y adaptan los datos para la interfaz. |
| `src/styles/` | Define variables visuales, estilos globales y ajustes responsive. |

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/login`, `/registro` | Acceso y creación de cuenta. Son públicas. |
| `/` | Inicio, resumen de biblioteca y actividad reciente. |
| `/explorar?q=...` | Búsqueda por texto, tipo y orden. La URL conserva el texto. |
| `/detalle/:id?tipo=track` o `?tipo=album` | Ficha de contenido, biblioteca, puntuación, reseña y colecciones. |
| `/biblioteca` | Contenido guardado, filtros y favoritos. |
| `/colecciones` | Creación y administración de colecciones. |
| `/perfil` | Datos de la cuenta, edición de biografía y géneros, favoritos y cierre de sesión. |
| `/estadisticas` | Totales, distribución por estado, géneros y actividad. |

Las rutas de la cuenta se renderizan dentro de `Layout`. `ProtectedRoute` espera la comprobación de sesión y redirige a `/login` guardando la ubicación solicitada. Tras iniciar sesión, el formulario recupera ese destino o envía al usuario a Inicio. [ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx) · [AccessForm.jsx](../src/components/ui/AccessForm.jsx)

## Sesión y transporte HTTP

[AuthProvider](../src/context/AuthContext.jsx) consulta `GET /api/auth/me` al iniciar. La sesión se guarda en una cookie HttpOnly emitida por el backend. Los componentes acceden al usuario y a las operaciones de sesión mediante `useAuth()`. El registro envía `username`, `email`, `password` y `passwordConfirm`. El acceso envía `email` y `password`.

[api.js](../src/services/api.js) centraliza el acceso HTTP. `apiRequest(path, options)` usa `fetch` con `credentials: "include"` y serializa el cuerpo como JSON cuando corresponde. `apiGetWithAxios` usa Axios con `withCredentials: true` para la búsqueda del catálogo. Ambos usan `VITE_API_URL` y comparten el manejo de respuestas:

- Devuelve el campo `data` de una respuesta válida y `null` para un `204 No Content`.
- Propaga el mensaje del backend y los campos `status` y `code` en los errores HTTP, cuando están disponibles.
- Emite `session-expired` al recibir un `401` fuera de `auth/`. El proveedor limpia el usuario y la ruta protegida vuelve a pedir acceso.

| Servicio | Rutas relativas a `/api` |
| --- | --- |
| [Autenticación](../src/services/authService.js) | `GET /auth/me`, `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `PATCH /users/me` |
| [Catálogo](../src/services/musicService.js) | `GET /catalog/search?q=...&tipo=...`, `GET /catalog/:spotifyId?tipo=...` |
| [Biblioteca y favoritos](../src/services/libraryService.js) | `GET/POST /library`, `PATCH/DELETE /library/:contentId`, `POST/DELETE /favorites/:contentId` |
| [Puntuaciones](../src/services/ratingService.js) | `PUT/DELETE /ratings/:contentId` |
| [Reseñas](../src/services/reviewService.js) | `GET/POST/PATCH/DELETE /reviews/:contentId` |
| [Colecciones](../src/services/collectionService.js) | `GET/POST /collections`, `GET/PATCH/DELETE /collections/:id`, `POST /collections/:id/items`, `DELETE /collections/:id/items/:contentId` |
| [Estadísticas y actividad](../src/services/statisticsService.js) | `GET /statistics`, `GET /activity` |

Las URLs de detalle usan el ID de Spotify con el tipo `track` o `album`. Para agregar a la biblioteca se envían esos dos valores dentro de `contenido`. Las operaciones sobre contenido registrado usan el ID interno del backend, disponible como `contentId` en el modelo. [models.js](../src/services/models.js)

## Flujos y estados de interfaz

- **Carga de recursos.** `useResource(loader)` expone `data`, `setData`, `loading`, `error` y `reload`. Definí `loader` fuera del componente o estabilizalo con `useCallback` si depende de parámetros. El hook conserva los datos durante una recarga e ignora las respuestas de efectos anteriores. [useResource.js](../src/hooks/useResource.js)
- **Explorar.** La búsqueda espera 350 ms después del cambio de texto o filtro y cancela la consulta anterior con `AbortController`. Sin texto consulta `pop`. La pantalla controla carga, error y resultados vacíos. El orden por nombre se aplica en el navegador. [Explore.jsx](../src/pages/Explore.jsx)
- **Detalle.** Carga el catálogo y la biblioteca en paralelo, con estados de carga independientes para la reseña y las colecciones. Para cambiar el estado o puntuar, guardá antes el contenido en tu biblioteca. Los cambios se ven de inmediato, se guardan en orden por campo y recuperan el último valor confirmado si falla el último guardado. [Detail.jsx](../src/pages/Detail.jsx)
- **Modales.** `Modal` usa `<dialog>` y `showModal()` para mantener inactiva la página de fondo. Escape invoca `onClose` y el foco vuelve al elemento guardado en `openerRef`. Guardá `event.currentTarget` en esa referencia antes de abrirlo. [Modal.jsx](../src/components/ui/Modal.jsx)

## Requisitos de la consigna

| Requisito | Ejemplo en el código |
| --- | --- |
| React, React Router, componentes funcionales y props | `App` define las rutas y `AlbumGrid` recibe `albums`. [App.jsx](../src/App.jsx) · [AlbumGrid.jsx](../src/components/music/AlbumGrid.jsx) |
| Fetch y Axios | La búsqueda usa Axios y las demás peticiones usan `fetch`. [musicService.js](../src/services/musicService.js) · [api.js](../src/services/api.js) |
| `useState`, `useEffect` y Context API | Gestión de sesión en `AuthProvider`. [AuthContext.jsx](../src/context/AuthContext.jsx) |
| `map`, `filter` y `reduce` | Render de tarjetas, filtro de biblioteca y cálculo de totales. [AlbumGrid.jsx](../src/components/music/AlbumGrid.jsx) · [Library.jsx](../src/pages/Library.jsx) · [Statistics.jsx](../src/pages/Statistics.jsx) |
| Renderizado condicional y formularios | Estados de Explorar y formulario de acceso. [Explore.jsx](../src/pages/Explore.jsx) · [AccessForm.jsx](../src/components/ui/AccessForm.jsx) |
| Diseño responsive | Consultas de medios y ajustes de columnas y navegación. [components.css](../src/styles/components.css) |
