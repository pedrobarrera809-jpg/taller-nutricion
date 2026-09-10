# Prompt para Claude Code en la terminal

Copiar todo lo que va debajo de la línea y pegarlo en `claude` estando dentro
de `D:\calude\taller-nutricion`.

---

Trabaja en `D:\calude\taller-nutricion`. Es la landing de registro de un taller
para nutricionistas, ya publicada en https://registro.institutodenutricionistas.com

Tu tarea: **dejar el formulario capturando nombre, apellido, correo y teléfono
en GoHighLevel, funcionando de verdad en producción.** Trabaja de forma autónoma;
solo detente en los puntos que abajo marco como "requiere al humano".

## Contexto que ya está resuelto — no lo rehagas

- **El despliegue va por `git push` a `main`.** Cloudflare Workers Builds está
  conectado al repo `pedrobarrera809-jpg/taller-nutricion` y construye solo.
  **No uses `wrangler deploy`.** Tarda ~40 s desde el push.
- `src/index.js` ya tiene el endpoint `POST /api/registro`. Valida correo y
  teléfono, normaliza a E.164 y reenvía a GoHighLevel. Soporta dos vías, y usa
  la que encuentre configurada:
  - `GHL_WEBHOOK_URL` (webhook de workflow), o
  - `GHL_TOKEN` + `GHL_LOCATION_ID` (API v2, `POST /contacts/upsert`).
  Sin ninguna de las dos responde 503 a propósito.
- `public/index.html` tiene dos formularios (`form.reg-form`, uno en el hero y
  otro en el cierre) que comparten un solo manejador JS y mandan el lead a
  `/api/registro`, luego redirigen a `/gracias?email=...`.
- `public/gracias.html` existe y funciona.
- Cuenta de GoHighLevel: instancia marca blanca **Embudos.AI**, en
  `app.gohighlevel.com`, interfaz en español.
  **Location ID: `rQSKPUKAJqIGKJYodG4k`**

## Callejones sin salida ya explorados — no pierdas tiempo ahí

- **La pantalla de Workflows es un iframe de otro dominio**
  (`client-app-automation-workflows.leadconnectorhq.com`). Los clics sintéticos
  no entran, el árbol de accesibilidad solo ve el cascarón y el JS no puede
  tocarla por ser otro origen. Abrir esa app fuera del iframe se cuelga, porque
  depende de la autenticación de la ventana padre. **No intentes automatizar
  la creación del workflow.**
- **`Settings → Private Integrations` SÍ es manejable**: esa página no está en
  iframe y responde al árbol de accesibilidad.
  URL: `https://app.gohighlevel.com/v2/location/rQSKPUKAJqIGKJYodG4k/settings/private-integrations`

Por eso: **usa la vía del token (API v2), no la del webhook.**

## Trabajo a realizar

### 1. Separar nombre y apellido en el formulario

Hoy hay un solo campo "Nombre y apellido" que el JS parte por el primer espacio
para deducir `firstName`/`lastName`. Eso falla con nombres compuestos.

Cambia **los dos formularios** de `public/index.html` a cuatro campos:

| label | name | requerido |
|---|---|---|
| Nombre | `nombre` | sí |
| Apellido | `apellido` | sí |
| Correo electrónico | `email` | sí |
| WhatsApp | `whatsapp` | sí |

Requisitos:
- Los `id` deben seguir siendo únicos entre ambos formularios (hoy usan prefijos
  `h-` para el hero y `f-` para el cierre). Mantén ese esquema. **Cinco ids
  duplicados ya rompieron este formulario una vez.**
- Cada campo con su `<label for="...">` real.
- En pantallas anchas, pon Nombre y Apellido en dos columnas dentro de la misma
  fila; en móvil que se apilen. Respeta el sistema de diseño existente
  (clase `.field`, tokens de color, móvil primero).
- Actualiza el JS: elimina la lógica que parte el nombre por el espacio y manda
  `firstName` y `lastName` directo desde los dos campos. Deja también `nombre`
  con el nombre completo concatenado, que el Worker ya lo usa.
- No toques la normalización del teléfono a E.164 ni el redirect a `/gracias`.

Actualiza `src/index.js` para aceptar el nuevo campo `apellido` si hace falta.

### 2. Crear el Private Integration Token en GoHighLevel

Usa las herramientas de navegador sobre el Chrome del usuario. Entra a la URL de
Private Integrations de arriba y crea una integración nueva con permisos
`contacts.write` y `contacts.readonly`.

**Manejo del token:** GoHighLevel lo muestra una sola vez. Es una credencial con
permiso de escritura sobre el CRM. No lo escribas en ningún archivo del
repositorio, no lo imprimas en la salida de la terminal más de lo estrictamente
necesario y no lo dejes en el historial de comandos. Pásalo directo al secreto
del Worker y olvídalo.

### 3. Guardar los secretos

Requiere `wrangler login` previo. **Esto requiere al humano**: abre el navegador
y hay que hacer clic en "Allow". Verifica primero con `npx wrangler whoami`; si
no está autenticado, pídeselo al usuario y espera.

Ya autenticado, guarda los dos secretos sin prompt interactivo:

    echo "EL_TOKEN" | npx wrangler secret put GHL_TOKEN
    echo "rQSKPUKAJqIGKJYodG4k" | npx wrangler secret put GHL_LOCATION_ID

Los secretos **no** viajan por el repositorio: se guardan directo en Cloudflare.

### 4. Publicar

Commit con mensaje descriptivo en español explicando el porqué, y `git push`
a `main`. Espera a que Cloudflare termine el build.

### 5. Verificar de verdad

No des la tarea por terminada sin comprobar, contra producción:

1. `POST /api/registro` con datos de prueba responde `{"ok":true}` y **no** 503.
2. El contacto **aparece realmente en GoHighLevel**, con nombre y apellido en
   campos separados y el teléfono en formato `+57...`. Compruébalo en la lista
   de contactos, no asumas que el 200 basta.
3. Enviando el formulario desde el navegador en la web publicada, se redirige a
   `/gracias` y no hay errores en consola.
4. Prueba también el formulario del cierre, no solo el del hero.
5. Registrar dos veces el mismo correo **no** debe duplicar el contacto
   (el endpoint usa `upsert`).

Si algo falla, arréglalo y vuelve a verificar. Reporta el resultado real: si un
paso no se pudo completar, dilo explícitamente en vez de darlo por hecho.

## Notas de estilo

- Todo el copy visible y los comentarios de código, en español.
- Respeta la disciplina de color del CSS: cian = interfaz, naranja = solo
  botones, dorado = una sola frase del titular, rojo = señal.
- Móvil primero.
- No toques los marcadores `[FECHA]`, `[HORA]`, `[ZONA]`, `[CUPOS]`: son
  intencionales y se llenan después.
