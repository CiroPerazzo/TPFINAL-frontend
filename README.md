# MUSICMAN · Frontend

Vistas del diseño My Collection implementadas en React con Vite y CSS. Diseño de escritorio fijo de 1440 × 1024 px, sin estilos responsive.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+.

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

## Vistas

| Ruta                   | Vista                                                                   |
| ---------------------- | ----------------------------------------------------------------------- |
| `/`                    | Inicio                                                                  |
| `/explorar`            | Exploración y filtros                                                   |
| `/detalle/after-hours` | Detalle de álbum (también admite los otros IDs de los datos de ejemplo) |
| `/biblioteca`          | Biblioteca                                                              |
| `/colecciones`         | Colecciones                                                             |
| `/perfil`              | Perfil                                                                  |
| `/estadisticas`        | Estadísticas                                                            |
| `/login`               | Iniciar sesión                                                          |
| `/registro`            | Crear cuenta                                                            |

## Integración con backend

Los datos de presentación están en `src/data/music.js`. Los componentes compartidos están en `src/components/` y las vistas en `src/App.jsx`. La tipografía Inter se sirve localmente desde el paquete instalado.

No se realizan llamadas HTTP ni se almacenan credenciales. Los formularios de acceso validan los campos y muestran un mensaje de demostración. Los favoritos, reseñas, preferencias y colecciones son ejemplos con estado en memoria: se reinician al recargar y algunos al cambiar de vista. Los resúmenes y las estadísticas muestran los valores fijos del Figma. El filtro de canciones queda vacío porque los datos de ejemplo contienen únicamente álbumes.

Al integrar el backend, reemplazar los datos de ejemplo y los manejadores locales por los servicios reales, y compartir el estado de usuario y biblioteca entre vistas. En un hosting estático, configurar las rutas para devolver `index.html` (React Router).

Diseño de referencia: https://www.figma.com/design/G1RyXAZtJXpfVL4aAhOHIk?node-id=0-1
