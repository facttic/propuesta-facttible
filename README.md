# propuesta-facttible

Herramienta de FACTTIC para publicar **propuestas y presupuestos** como una página web
—linda, cifrada y protegida por contraseña— en vez de mandar un PDF. Compartís un link,
la persona pone la contraseña y ve la propuesta.

Está pensada para que la use **cualquier integrante de FACTTIC**: un mismo deploy aloja
varias propuestas (una por cliente), y cada una se elige con `?for=<slug>` en la URL.

Hecho con Vite + React + TypeScript + Tailwind. Estética FACTTIC: fondo carbón, acento
naranja (`#ff5229`) y secundario teal (`#57c3c8`), títulos en Space Grotesk y cuerpo en
Space Mono. Tema claro por defecto, con toggle a oscuro.

---

## Cómo funciona

- Cada propuesta vive en un archivo **plano** `content.<slug>.json` (por ejemplo
  `content.kioshi.json`). Ese archivo **nunca se commitea** — está en `.gitignore`.
- El comando `encrypt` lo cifra con **AES-256-GCM** (clave derivada de la contraseña con
  PBKDF2, 600k iteraciones) y genera `public/content.<slug>.enc.json`. **Ese sí se
  commitea**: es texto ilegible sin la contraseña.
- En el navegador, la app lee `?for=<slug>` de la URL, baja el `.enc.json`
  correspondiente, pide la contraseña y **descifra en memoria**. Nada viaja al servidor.
- Por eso el **repo puede ser público**: solo contiene contenido cifrado.

> La seguridad depende de la contraseña. Usá una fuerte y compartila por un canal aparte
> del link (no en el mismo mail/chat).

---

## Requisitos

- **Node 22+** y **npm**
- **git** (el deploy publica en la rama `gh-pages`)

---

## Levantar en local

```bash
git clone git@github.com:facttic/propuesta-facttible.git
cd propuesta-facttible
npm install

# crear una propuesta de prueba: escribí content.demo.json con la estructura del
# template (ver src/types.ts → BrzaContent) y cifralo
PASSWORD="una-clave-de-prueba" npm run encrypt -- demo

npm run dev
# abrir http://localhost:5173/?for=demo  (contraseña: una-clave-de-prueba)
```

Sin `?for=<slug>` la app muestra una pantalla vacía a propósito: siempre hay que indicar
qué propuesta abrir.

---

## Crear una propuesta nueva

1. Elegí un **slug** corto en minúsculas (letras, números y guiones): `kioshi`,
   `cliente-x`, etc.
2. Creá `content.<slug>.json` con el contenido. La estructura del template está tipada en
   [`src/types.ts`](src/types.ts) → `BrzaContent` (portada, contexto, el proceso, plan e
   inversión, siguientes pasos, etc.). Podés partir de una propuesta existente como base.
3. Cifralo:
   ```bash
   PASSWORD="una-contraseña-única-y-fuerte" npm run encrypt -- <slug>
   ```
   Esto escribe `public/content.<slug>.enc.json`.
4. Commiteá **solo el cifrado**:
   ```bash
   git add public/content.<slug>.enc.json
   git commit -m "Propuesta <slug>"
   ```
5. Publicá (ver abajo) y compartí el link + la contraseña.

Cada propuesta tiene su propio archivo y su propia contraseña; los cifrados son
independientes entre sí.

---

## Deploy

Un solo comando buildea y publica en GitHub Pages (rama `gh-pages`):

```bash
./deploy.sh
```

En ~1 minuto queda online. **Pages sirve el sitio bajo el nombre del repo**, así que la
URL base es:

```
https://facttic.github.io/propuesta-facttible/
```

Y cada propuesta se abre agregando su slug:

```
https://facttic.github.io/propuesta-facttible/?for=kioshi
https://facttic.github.io/propuesta-facttible/?for=cliente-x
```

Eso es lo que le pasás a cada cliente (con la contraseña por separado).

> **Cómo publica el script:** `deploy.sh` corre `npm run build` y hace force-push del
> contenido de `dist/` a la rama `gh-pages`. Esa rama solo contiene el build, no tiene
> historia que preservar. Requiere tener permiso de push en el repo.

---

## Seguridad — lo importante

- **Nunca** commitees `content.<slug>.json` (el plano). Ya está en `.gitignore`, pero
  revisá `git status` antes de commitear.
- Los **PDFs** también están ignorados (`*.pdf`): pueden contener la propuesta en claro.
- Contraseña **fuerte** y por **canal aparte** del link.
- Para rotar una contraseña: volvé a correr `encrypt` con la nueva y redeployá.

---

## Estructura del proyecto

```
content.<slug>.json              contenido plano de cada propuesta (gitignored)
public/content.<slug>.enc.json   contenido cifrado (se commitea y se publica)
scripts/encrypt.mjs              cifra content.<slug>.json → public/content.<slug>.enc.json
deploy.sh                        build + publish en gh-pages
src/types.ts                     estructura del contenido (BrzaContent)
src/sections/                    secciones de la propuesta (portada, proceso, plan, etc.)
```
