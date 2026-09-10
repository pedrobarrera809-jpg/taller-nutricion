# Conectar el formulario con GoHighLevel

Cuenta: **pedrobarrera809@gmail.com**

Todo el código ya está listo y probado. Falta **un solo dato tuyo**: el destino
en GoHighLevel. Elige una de las dos vías.

---

## Cómo funciona (y por qué no es directo)

```
Formulario de la landing
        ↓  POST /api/registro   (mismo dominio, sin CORS)
Worker de Cloudflare  ← aquí vive el secreto, invisible desde el navegador
        ↓
GoHighLevel  → crea el contacto → dispara tu workflow (correo + WhatsApp)
        ↓
El navegador va a  /gracias?email=...
```

**Por qué no mandamos el lead directo del navegador a GoHighLevel:** habría que
poner el token dentro del HTML, y cualquiera que abra «ver código fuente» podría
copiarlo y escribir en tu cuenta. El Worker lo guarda cifrado del lado del
servidor.

---

## Vía A · Webhook de workflow (recomendada, 5 minutos, sin token)

1. En GoHighLevel entra a **Automation → Workflows → Create Workflow**.
2. Como disparador elige **Inbound Webhook**. Copia la URL que te da
   (algo como `https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...`).
3. En esa misma terminal, parado en esta carpeta:

```bash
npx wrangler secret put GHL_WEBHOOK_URL
```

Te va a pedir el valor: pega la URL y dale Enter. **Yo nunca la veo.**

4. Publica:

```bash
npx wrangler deploy
```

5. En el workflow, después del disparador, agrega los pasos: **Create/Update
   Contact**, el correo con el enlace y el mensaje de WhatsApp.

### Campos que le llegan al webhook

| Campo | Ejemplo | Nota |
|---|---|---|
| `firstName` | `Ana` | primera palabra del nombre |
| `lastName` | `Maria Perez Gomez` | el resto |
| `name` | `Ana Maria Perez Gomez` | completo |
| `email` | `ana@ejemplo.com` | siempre en minúsculas |
| `phone` | `+573001234567` | formato E.164, listo para WhatsApp |
| `origen` | `hero` o `cierre` | qué formulario convirtió |
| `source` | `landing-registro` | |
| `url` | `https://registro...` | |

Desde `/gracias` llega además un segundo envío, con el mismo `email` y:

| Campo | Valores |
|---|---|
| `origen` | `encuesta-gracias` |
| `consulta` | Presencial · Virtual · Ambas · Todavía no |
| `cuello` | Historias clínicas · Planes y minutas · Seguimiento entre consultas · Cobrar y agendar |

En el workflow, ramifica por `origen` para no volver a mandar el correo de
bienvenida cuando lo que llega es la encuesta.

---

## Vía B · API v2 con Private Integration Token

Si prefieres que el contacto se cree por API en vez de por workflow:

1. GoHighLevel → **Settings → Private Integrations → Create**.
   Dale permisos de `contacts.write` y `contacts.readonly`.
2. Copia el token y el **Location ID** (Settings → Business Profile).
3. Guarda los dos secretos:

```bash
npx wrangler secret put GHL_TOKEN
```

```bash
npx wrangler secret put GHL_LOCATION_ID
```

4. Publica con `npx wrangler deploy`.

El Worker usa `POST /contacts/upsert`, así que si alguien se registra dos veces
no se duplica el contacto. Les pone las etiquetas `taller-ia-nutricion` y
`origen-hero` / `origen-cierre`.

> Si defines las dos vías, gana la A (el webhook).

---

## Mientras no configures nada

El endpoint responde **503** y el formulario muestra: *«No pudimos guardar tu
registro»*. **Es a propósito.** Prefiero que falle a la vista antes que aceptar
registros y perderlos en silencio.

---

## Lo que falta llenar a mano

En `public/gracias.html`, al final, hay un bloque `CONFIG` con cuatro líneas:

```js
whatsappGroup: '',   // enlace https://chat.whatsapp.com/... del grupo
eventStart:    '',   // '20260924T230000Z'  (UTC; 23:00Z = 6:00 p.m. Bogotá)
eventEnd:      '',   // '20260925T003000Z'
```

Mientras estén vacíos, los botones de calendario y de WhatsApp aparecen
apagados y no hacen nada. También falta el **video de 60 s** (hay un hueco
marcado) y reemplazar `[FECHA]` / `[HORA]` / `[ZONA]` en las dos páginas.

En `public/index.html`, si tu lista no es principalmente colombiana, cambia:

```js
var PAIS_POR_DEFECTO = '57';
```

Es el código que se le pone al número cuando alguien lo escribe sin él.

---

## Probar en local antes de publicar

```bash
npx wrangler dev --port 8790
```

Para probar el envío sin tocar GoHighLevel, crea un archivo `.dev.vars` con
`GHL_WEBHOOK_URL="https://..."` apuntando a donde quieras. Ese archivo está en
`.gitignore` y no se sube.
