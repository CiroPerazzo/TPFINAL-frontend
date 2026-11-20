# MUSICMAN · Frontend

Frontend del TP Final DAI/EFSI. Permite explorar canciones y álbumes de Spotify, guardar contenido en una biblioteca personal, marcar favoritos, cambiar el estado de escucha, puntuar, escribir reseñas y organizar colecciones. Inicio y Estadísticas muestran la actividad de la cuenta.

## Instalación local

Usá Node.js 22.12 o superior de la serie 22, o Node.js 24, con npm. El frontend usa React, React Router y Vite. Para usar la aplicación completa necesitás el backend Express, PostgreSQL con las migraciones aplicadas y credenciales de Spotify para consultar el catálogo.

1. Configurá PostgreSQL y Spotify en el backend, ejecutá `npm run migrate` e iniciá el servidor con `npm run dev`. El puerto predeterminado es `3000`. [Guía del backend](https://github.com/suculento666/TP-Final-DAI-EFSI)
2. Desde la raíz de este repositorio, instalá las dependencias y arrancá Vite.

   ```bash
   npm ci
   npm run dev
   ```

3. Abrí [http://localhost:5173](http://localhost:5173) y registrá una cuenta o iniciá sesión.

### Configuración

Los valores locales funcionan por defecto. Para cambiarlos, copiá [.env.example](.env.example) a `.env` y reiniciá Vite después de editarlo.

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | URL base de las peticiones del navegador. Se incorpora al compilar. |
| `API_PROXY_TARGET` | `http://localhost:3000` | Destino al que Vite reenvía las solicitudes a `/api` en desarrollo y vista previa. |

Guardá las credenciales de Spotify, PostgreSQL y JWT en el entorno del backend. Las variables `VITE_*` quedan disponibles en el código que recibe el navegador.

## Scripts

| Comando | Resultado |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente el último build. |

## Despliegue

Compilá con `npm run build` y publicá `dist/`. Para probarlo en local, detené el servidor de desarrollo antes de ejecutar `npm run preview`: ambos usan el puerto `5173` y el proxy configurado en Vite.

Para publicar frontend y backend en orígenes separados, definí `VITE_API_URL=https://<backend>/api` antes de compilar. En el backend, configurá `FRONTEND_URL` con el origen público del frontend y usá `NODE_ENV=production` y HTTPS para las cookies de sesión. Configurá el hosting del frontend para servir `index.html` al entrar directamente a rutas como `/biblioteca`. Si preferís conservar `VITE_API_URL=/api` en producción, configurá el reenvío de `/api` en tu hosting.

## Prueba manual

1. Registrá una cuenta y recargá una pantalla privada. La sesión debería mantenerse. Cerrá sesión y comprobá que esa pantalla vuelve a pedir acceso.
2. Buscá un artista en Explorar y alterná los filtros de canciones y álbumes. Abrí un resultado, guardalo, cambiá su estado, puntúalo y escribí una reseña. Recargá el detalle y comprobá que los datos coinciden.
3. Creá una colección desde Colecciones, agregale ese contenido desde Detalle y comprobá que aparezca al abrirla.
4. Repetí la navegación principal con el teclado y en una ventana angosta para revisar foco, contenido y desbordamientos.

## Problemas frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| Vite indica que el puerto está ocupado | Detené el proceso que usa el puerto `5173`. Vite tiene `strictPort` activado. |
| La interfaz no puede conectar al servidor | Verificá que Express esté en ejecución y escucha en el puerto configurado en `API_PROXY_TARGET`. |
| El inicio de sesión funciona, pero se pierde al recargar | Revisá en el navegador si el backend estableció la cookie. Si son orígenes distintos, verificá HTTPS y que `FRONTEND_URL` coincida con el origen del frontend. |
| Explorar muestra un error del catálogo | Revisá la configuración de Spotify y el registro de errores en el backend. |

## Documentación técnica

La [guía técnica del frontend](docs/frontend.md) reúne las rutas, los contratos que consume la interfaz, el flujo de datos y la correspondencia con la consigna.
