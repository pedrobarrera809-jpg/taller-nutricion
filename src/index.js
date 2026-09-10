/**
 * Worker de registro.institutodenutricionistas.com
 *
 * Hace dos cosas:
 *   1. POST /api/registro  → recibe el lead de la landing y lo manda a GoHighLevel.
 *   2. Cualquier otra ruta → sirve los archivos de /public tal cual.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO
 * El token de GoHighLevel NO puede vivir en el HTML: cualquiera que abra
 * "ver código fuente" en la página lo vería y podría escribir en la cuenta.
 * Aquí el token es un secreto del Worker, invisible desde el navegador.
 *
 * CONFIGURACIÓN — elige UNA de las dos vías y ejecuta el comando:
 *
 *   Vía A · Webhook de un workflow (la más simple, sin token):
 *     npx wrangler secret put GHL_WEBHOOK_URL
 *
 *   Vía B · API v2 con Private Integration Token:
 *     npx wrangler secret put GHL_TOKEN
 *     npx wrangler secret put GHL_LOCATION_ID
 *
 * Si no hay ninguna configurada, el endpoint responde 503 a propósito:
 * es preferible que el formulario muestre un error a que se pierdan leads
 * en silencio.
 */

const GHL_API = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';
const MAX_BODY = 4096; // bytes; un registro legítimo no pasa de ~500

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/registro') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'Método no permitido' }, 405);
      }
      return registrar(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  }
};

async function registrar(request, env, ctx) {
  // --- leer y validar ---
  let datos;
  try {
    const crudo = await request.text();
    if (crudo.length > MAX_BODY) return json({ ok: false, error: 'Payload demasiado grande' }, 413);
    datos = JSON.parse(crudo);
  } catch {
    return json({ ok: false, error: 'JSON inválido' }, 400);
  }

  const email = String(datos.email || '').trim().toLowerCase();
  const phone = String(datos.phone || '').trim();
  const esEncuesta = datos.origen === 'encuesta-gracias';

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return json({ ok: false, error: 'Correo inválido' }, 400);
  }
  // La encuesta de /gracias no manda teléfono: el contacto ya existe.
  if (!esEncuesta && !/^\+\d{10,15}$/.test(phone)) {
    return json({ ok: false, error: 'Teléfono inválido' }, 400);
  }

  const contacto = {
    firstName: recortar(datos.firstName, 80),
    lastName:  recortar(datos.lastName, 80),
    name:      recortar(datos.nombre, 160),
    email,
    phone:     phone || undefined,
    source:    recortar(datos.fuente || 'landing-registro', 60),
    origen:    recortar(datos.origen, 40),
    consulta:  recortar(datos.consulta, 60),   // solo llega desde /gracias
    cuello:    recortar(datos.cuello, 60),     // solo llega desde /gracias
    url:       recortar(datos.url, 300)
  };

  // --- Vía A: webhook de workflow ---
  if (env.GHL_WEBHOOK_URL) {
    const r = await fetch(env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacto)
    });
    if (!r.ok) {
      console.error('GHL webhook respondió', r.status, await r.text().catch(() => ''));
      return json({ ok: false, error: 'No se pudo guardar el registro' }, 502);
    }
    return json({ ok: true });
  }

  // --- Vía B: API v2 (upsert: no falla si el contacto ya existe) ---
  if (env.GHL_TOKEN && env.GHL_LOCATION_ID) {
    const cuerpo = {
      locationId: env.GHL_LOCATION_ID,
      firstName:  contacto.firstName,
      lastName:   contacto.lastName,
      email:      contacto.email,
      source:     contacto.source,
      tags:       ['taller-ia-nutricion', `origen-${contacto.origen || 'directo'}`]
    };
    if (contacto.phone) cuerpo.phone = contacto.phone;

    const r = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GHL_TOKEN}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(cuerpo)
    });

    if (!r.ok) {
      console.error('GHL API respondió', r.status, await r.text().catch(() => ''));
      return json({ ok: false, error: 'No se pudo guardar el registro' }, 502);
    }
    return json({ ok: true });
  }

  console.error('Sin GHL configurado: define GHL_WEBHOOK_URL o GHL_TOKEN + GHL_LOCATION_ID');
  return json({ ok: false, error: 'Registro no configurado todavía' }, 503);
}

function recortar(v, max) {
  const s = String(v ?? '').trim();
  return s ? s.slice(0, max) : undefined;
}

function json(cuerpo, status = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
