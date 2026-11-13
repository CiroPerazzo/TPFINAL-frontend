# MUSICMAN frontend

React y Vite, conectado al backend Express de My Collection. Incluye registro,
login, recuperación de sesión por cookie HttpOnly, búsqueda en Spotify,
biblioteca, favoritos, puntuaciones, reseñas, colecciones, perfil y estadísticas.
Las pantallas consultan la API; no usan los datos de demostración.

## Desarrollo

Requisitos: Node 22.12+ o Node 24, npm y el backend con PostgreSQL configurado.

```bash
npm install
npm run dev
```

Iniciar también el backend con `npm run dev` y abrir http://localhost:5173.
Vite mantiene el puerto 5173 y reenvía `/api` al backend en el puerto 3000.
Para otro destino, copiar `.env.example` a `.env` y ajustar `API_PROXY_TARGET`.
`VITE_API_URL` vale `/api` por defecto. Nunca poner secretos de Spotify ni de
PostgreSQL en variables `VITE_*`, porque quedan expuestas al navegador.

La autenticación utiliza `credentials: include`. Registro envía `username`,
`email`, `password` y `passwordConfirm`; login usa email y contraseña. Al
recargar se consulta `/api/auth/me`. Cerrar sesión está disponible en Perfil.
Los errores del servidor se muestran en las pantallas.

Los enlaces de contenido conservan el ID de Spotify y el tipo (`track`/`album`).
Las escrituras de favoritos, reseñas, puntuaciones y colecciones usan el ID
numérico interno devuelto por el backend. El nombre de usuario no es editable:
el contrato actual permite editar biografía y géneros preferidos.

## Compilación y despliegue

```bash
npm run build
npm run preview
```

`preview` también usa el proxy local. En hosting separado, definir
`VITE_API_URL=https://HOST_BACKEND/api` antes de compilar; configurar el backend
con `FRONTEND_URL=https://HOST_FRONTEND`, `NODE_ENV=production` y HTTPS.
Configurar el hosting para servir `index.html` en las rutas de React.
El proxy local de Vite no se incluye en `dist`.

## Verificación de integración

Desde el backend hermano ejecutar `npm run test:frontend`. Esta prueba carga
estos servicios y la configuración de Vite, inicia Express y verifica el flujo
HTTP con PostgreSQL en un esquema temporal. Solo Spotify se reemplaza por una
respuesta controlada. No sustituye una prueba visual en navegador.

Para búsquedas reales, el backend necesita credenciales válidas de Spotify.
Si Spotify rechaza su token, la interfaz muestra el error sin inventar datos.
