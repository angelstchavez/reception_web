# Reception Web

Interfaz del sistema de control de acceso. La app utiliza una pasarela interna de Next.js para consumir la Reception API: los tokens se guardan en cookies HTTP-only y se renuevan automáticamente. La operación de escaneo NFC no forma parte de esta interfaz.

## Configuración

Copia `.env.template` a `.env` y configura la dirección del backend:

```env
RECEPTION_API_URL=http://localhost:8000
```

No añadas `/api` a `RECEPTION_API_URL`: la API expone directamente rutas como `/auth/login`, `/auth/logout` y `/access-events`.

## Desarrollo

```bash
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000). La pasarela queda disponible bajo `/api/reception/*` y reenvía las llamadas al backend configurado.

## Verificación

```bash
bun run lint
bun run build
```
