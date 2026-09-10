# Conectar GoHighLevel — pasos manuales

Ruta del **Inbound Webhook**. Estado al empezar: el workflow ya existe y el
trigger ya está agregado, con la URL visible en el panel lateral.

---

## A · En GoHighLevel (2 clics)

1. En el panel del trigger, clic en el **ícono de copiar** al final del campo
   **URL (POST/GET/PUT)**. Es el iconito a la derecha del texto.
2. **Save trigger**.

No toques todavía **Fetch sample requests**. Ese botón busca peticiones que ya
llegaron; si lo pulsas antes de que la landing mande una, no encuentra nada y
los campos salen vacíos.

Deja la pestaña abierta, vuelves en el paso C.

---

## B · Guardar la URL como secreto

Dos formas. La primera no necesita terminal.

### B1 · Desde el panel de Cloudflare (recomendada)

1. Entra a **dash.cloudflare.com**
2. **Workers & Pages** → abre el Worker **taller-nutricion**
3. Pestaña **Settings**
4. Sección **Variables and Secrets** → botón **+ Add**
5. Rellena:
   - **Type:** `Secret` (no "Text" — si lo dejas en texto plano, la URL queda
     visible para cualquiera que entre al panel)
   - **Variable name:** `GHL_WEBHOOK_URL`
   - **Value:** pega la URL del paso A1
6. **Save** / **Deploy** según te lo pida la interfaz.

### B2 · Desde la terminal

Requiere autorizar el acceso una vez:

    npx wrangler login

Se abre el navegador, das **Allow**. Después:

    npx wrangler secret put GHL_WEBHOOK_URL

Te pide el valor: pegas la URL y Enter.

> El secreto se guarda directo en Cloudflare, **no** en el repositorio. No hace
> falta volver a desplegar: aplica sobre el Worker que ya está en vivo.

---

## C · Mandar la primera petición real

1. Entra a **https://registro.institutodenutricionistas.com**
2. Llena el formulario con **tus datos reales** (nombre, correo y tu WhatsApp
   con código de país).
3. Debe llevarte a **/gracias**.

**Si en vez de eso ves el mensaje rojo "No pudimos guardar tu registro"**, el
secreto no quedó bien guardado. Revisa el paso B: nombre exacto
`GHL_WEBHOOK_URL`, tipo Secret, URL completa sin espacios al final.

---

## D · Mapear los campos en GoHighLevel

1. Vuelve al workflow. Abre el trigger **Inbound Webhook**.
2. Ahora sí: **Fetch sample requests**. Debe aparecer la petición del paso C.
3. Selecciónala para que GHL aprenda la estructura.
4. **+ Add Action** → **Create/Update Contact**.
5. Mapea:

| Campo en GoHighLevel | Valor del webhook |
|---|---|
| First Name | `firstName` |
| Last Name | `lastName` |
| Email | `email` |
| Phone | `phone` |

El teléfono ya llega normalizado a formato internacional (`+573001234567`),
que es lo que GoHighLevel necesita para poder escribir por WhatsApp.

También te llegan, por si los quieres usar:

| Campo | Para qué sirve |
|---|---|
| `name` | nombre completo, sin partir |
| `origen` | `hero` o `cierre` — qué formulario convirtió |
| `source` | siempre `landing-registro` |
| `url` | la página desde donde se registró |

`origen` es útil para saber si la gente convierte arriba (antes de leer) o
abajo (después de leerlo todo). Guárdalo como campo personalizado o como
etiqueta.

6. Agrega después las acciones de envío: el correo con el enlace y el mensaje
   de WhatsApp.
7. **Publish** el workflow. Un workflow en borrador **no se ejecuta**.

---

## E · Comprobar que de verdad quedó

No te fíes de que la landing te haya llevado a `/gracias`. Eso solo prueba que
el Worker aceptó el dato, no que GoHighLevel lo haya guardado.

1. **Contacts** en GoHighLevel: tu contacto de prueba debe estar ahí, con
   nombre, correo y teléfono en `+57...`.
2. Vuelve a registrarte con el **mismo correo**: no debe crear un duplicado.
3. Prueba también el **formulario del cierre** (el de abajo del todo), no solo
   el del hero. Son dos formularios distintos.
4. Revisa **Execution logs** del workflow: ahí ves cada disparo y si alguno falló.

---

## Después: migrar al token (opcional, sin cargo por ejecución)

El Inbound Webhook es un **trigger premium**: cobra por ejecución. Si el volumen
crece, conviene migrar.

El código del Worker ya soporta las dos vías, así que migrar **no requiere tocar
código**:

1. GoHighLevel → **Settings → Private Integrations → Create**, con permisos
   `contacts.write` y `contacts.readonly`.
2. Guarda dos secretos nuevos (panel de Cloudflare o terminal):
   - `GHL_TOKEN` = el token
   - `GHL_LOCATION_ID` = `rQSKPUKAJqIGKJYodG4k`
3. **Borra el secreto `GHL_WEBHOOK_URL`.** Mientras exista, tiene prioridad y
   se sigue usando el webhook.
4. En el workflow, cambia el trigger de **Inbound Webhook** a **Contact tag**,
   con la etiqueta `taller-ia-nutricion`. Esa etiqueta se la pone el Worker
   automáticamente al crear el contacto. Es un trigger estándar, sin cargo.

Con esta vía el contacto se crea por API con `upsert`, así que tampoco duplica.
