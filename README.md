# FACTTIC · Presupuestos

Presupuestos de FACTTIC en una página, cifrados y protegidos por contraseña. Un mismo deploy puede alojar varios presupuestos, elegidos vía `?for=<slug>` en la URL.

Hecho con Vite + React + TypeScript + Tailwind. Estética FACTTIC: fondo carbón, acento naranja (`#ff5229`) y secundario teal (`#57c3c8`), títulos en Space Grotesk y cuerpo en Space Mono.

## Cómo funciona

- `content.<slug>.json` (gitignored) tiene el contenido en texto plano de un presupuesto.
- `PASSWORD="..." npm run encrypt -- <slug>` deriva una clave con PBKDF2 (600k iteraciones), cifra el JSON con AES-256-GCM y escribe el texto cifrado en `public/content.<slug>.enc.json` (eso sí se commitea).
- El navegador lee `?for=<slug>` de la URL, descarga el cifrado correspondiente, pide la contraseña y descifra en memoria.
- El repo puede ser público: nunca se commitea contenido en texto plano.

## Desarrollo local

```bash
npm install
PASSWORD="tu-contraseña" npm run encrypt -- demo
npm run dev
# abrir http://localhost:5173/?for=demo
```

## Agregar un nuevo presupuesto

1. Crear `content.<slug>.json` con el contenido (estructura del template, ver `src/types.ts` → `BrzaContent`).
2. Ejecutar `PASSWORD="contraseña-única" npm run encrypt -- <slug>`
3. Commitear `public/content.<slug>.enc.json`
4. Compartir la URL `https://<sitio>/?for=<slug>` y la contraseña por un canal aparte.

Cada presupuesto tiene su propio archivo y su propia contraseña. Los cifrados son independientes.

## Deploy

Push a `main`. GitHub Actions buildea y publica en GitHub Pages.
