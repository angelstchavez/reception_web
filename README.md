# Reception Web

Interfaz del sistema de control de acceso. La app utiliza una pasarela interna de Next.js para consumir la Reception API: los tokens se guardan en cookies HTTP-only y se renuevan automáticamente. La operación de escaneo NFC no forma parte de esta interfaz.

## Configuración

Copia `.env.template` a `.env` y configura la dirección del backend:

```env
RECEPTION_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` se admite temporalmente para instalaciones existentes, pero `RECEPTION_API_URL` es la variable recomendada porque no se expone al navegador.

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
