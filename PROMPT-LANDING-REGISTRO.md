# Prompt maestro — Landing de registro
**institutodenutricionistas.com/registro** · Instituto para Nutricionistas Dietistas

Este documento es la fuente de verdad de la página. Contiene (A) el prompt completo para reconstruirla desde cero con cualquier modelo, y (B) el copy literal de las 10 secciones. Si cambias el copy aquí, cámbialo también en `public/index.html`.

---

## A. PROMPT

> Construye una landing page de **respuesta directa** para `institutodenutricionistas.com/registro`.
> Entrega **un solo archivo HTML autocontenido** (CSS y JS embebidos, sin frameworks, sin dependencias externas salvo Google Fonts). Español de Latinoamérica.

### Negocio

Instituto para Nutricionistas Dietistas. Lo dirige **Pedro Barrera**, nutricionista dietista titulado, **+1.000 pacientes** atendidos en nutrición clínica y deportiva.

Pedro construyó sus propias herramientas digitales de consulta —anamnesis, calculadoras, planillas de seguimiento, minutas editables y prompts de IA— que le redujeron **cerca del 70%** del tiempo de consulta. Ahora enseña a otros nutricionistas a diseñar **las suyas**.

**El diferencial que no se puede diluir:** no entrega herramientas hechas. Lo que el nutricionista construye durante la formación **le queda como producto propio**. No es una suscripción, no es una licencia, no es un acceso que se vence.

### ICP

Nutricionistas tradicionales de Latinoamérica. **Escépticos del uso de IA** en salud. Pierden mucho tiempo en tareas repetitivas de consulta (digitar historias, rehacer formatos, escribir la misma minuta). No son técnicos y no quieren serlo.

Consecuencias de diseño:

- Nada de jerga técnica ("workflow", "no-code", "stack", "automatización end-to-end").
- Nada de promesas de dinero, "libertad financiera" o "escalar tu consulta".
- El escepticismo se responde **mostrando**, no discutiendo: la página incluye una demostración visible de una herramienta funcionando.
- Se nombra explícitamente el límite clínico: la IA no diagnostica, el nutricionista sí.

### Objetivo único

Que el visitante **se registre al taller en vivo gratuito**. Al registrarse recibe **acceso inmediato a una masterclass grabada**.

- **No** hay precios en la página.
- **No** hay fechas ni horas en la página.
- **No** hay contador regresivo ni "cupos limitados" numéricos.
- Todos los botones y todos los enlaces apuntan al formulario. Nada más.

### Reglas de construcción

1. **Una sola página. Sin menú de navegación.** Se permite una marca discreta arriba, sin enlaces.
2. **Móvil primero.** Se diseña a 360 px y se expande. Nada depende del hover. Barra fija inferior con CTA en móvil, oculta en escritorio.
3. **Tono claro y directo.** Frases cortas. Segunda persona. Sin adjetivos de venta vacíos. Si una frase no ayuda a decidir, se borra.
4. **Un solo CTA repetido**, siempre con el mismo texto y siempre hacia `#registro`.
5. **Accesibilidad:** contraste AA, `label` real en cada campo, `focus-visible` visible, respeto a `prefers-reduced-motion`, jerarquía correcta de encabezados.
6. **Rendimiento:** sin librerías. Imágenes con `loading="lazy"` y `width`/`height`. Los "pantallazos" de herramientas se dibujan en HTML/CSS, no como imágenes.

### Sistema visual

Tema oscuro único, pintado explícitamente (nada depende del tema del navegador).

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0A0E27` | fondo |
| `--panel` | `#0F172A` | tarjetas y paneles |
| `--cyan` | `#00D9FF` | **interfaz**: etiquetas, bordes vivos, datos, iconos |
| `--orange` | `#FF6B35` | **acción**: SOLO botones |
| `--gold` | `#FFD700` | **la promesa**: una sola frase del titular, nada más |
| `--live` | `#FF4444` | **señal**: punto del directo y las ✕ de dolor |

Tipografías: `Archivo` (interfaz y titulares) y `Source Serif 4` (solo el documento clínico de la demostración, para que se lea como un documento y no como una web).

**Disciplina de color:** cada acento tiene un solo trabajo. Romper esta regla es lo que hace que una página se sienta ruidosa en vez de brillante.

### Estructura exacta (en este orden)

1. **Badge de autoridad** — arriba del titular.
2. **Titular + subtítulo** — la promesa lleva incorporado el costo de no actuar.
3. **Descripción breve** — 3 beneficios.
4. **CTA principal temprano** — botón visible sin hacer scroll.
5. **"¿Esto te suena?"** — 4 dolores concretos + frase puente.
6. **La solución** — 5 bloques de beneficio numerados.
7. **Qué se lleva el nutricionista al final.**
8. **CTA de cierre** — con la autoridad repetida.
9. **FAQ** — 4 preguntas.
10. **Formulario** — nombre, correo, WhatsApp (opcional), botón.

En el hero (secciones 1-4) va, a la derecha en escritorio y debajo en móvil, una **ventana de demostración** que escribe sola una anamnesis, un cálculo y una minuta, con pestañas para saltar entre las tres. Es la respuesta al escepticismo: se ve funcionando antes de pedir el correo.

### Formulario

- Campos: `nombre` (requerido), `email` (requerido), `whatsapp` (**opcional**, marcado como opcional en la etiqueta).
- `action=""` vacío: el JS detecta que no hay proveedor conectado y muestra el estado de éxito sin recargar. Al poner una URL en `action`, el envío pasa a ser real.
- Estado de éxito dentro de la misma tarjeta, con `aria-live`.
- Microcopy bajo el botón: qué recibe y cuándo.

---

## B. COPY LITERAL DE LAS 10 SECCIONES

### 1 · Badge de autoridad

> Pedro Barrera · Nutricionista Dietista · +1.000 pacientes atendidos

### 2 · Titular + subtítulo

**Titular** (el resaltado en dorado va en «que son tuyas»):

> Aprende a diseñar tus propias herramientas de consulta con IA — **que son tuyas**

**Subtítulo:**

> Aquí no te entrego plantillas hechas. Te enseño a construir las tuyas: anamnesis, calculadoras, minutas y planillas de seguimiento que quedan a tu nombre y que nadie te puede quitar. Cada mes que lo pospones son decenas de horas escribiendo otra vez lo mismo que ya escribiste ayer.

### 3 · Descripción breve — 3 beneficios

1. **Salen tuyas.** Lo que construyes queda como producto propio, no como una suscripción que se vence.
2. **Menos digitar, más mirar al paciente.** El mismo método con el que recorté cerca del 70% de mi tiempo de consulta.
3. **Sin código y sin jerga.** Si sabes usar un documento y WhatsApp, puedes hacerlo.

### 4 · CTA principal

> **Registrarme al taller gratis**
>
> Microcopy: Es gratis. Al registrarte recibes de inmediato la masterclass grabada.

### 5 · ¿Esto te suena?

**Titular de sección:** ¿Esto te suena?

**Los 4 dolores:**

1. Terminas la consulta y todavía te faltan veinte minutos de digitación por cada paciente que atendiste.
2. Escribes la misma anamnesis, la misma minuta y las mismas indicaciones una y otra vez, cambiando tres datos.
3. Cada vez que ajustas tu enfoque, rehaces tus formatos desde cero en Word o en Excel.
4. Escuchas a colegas hablando de IA, pero nadie te ha mostrado un ejemplo real aplicado a nutrición — y no vas a experimentar con tus pacientes.

**Frase puente:**

> No es falta de disciplina ni de vocación. Es que estás haciendo a mano un trabajo que tu consulta ya puede hacer sola, y nadie te ha mostrado cómo.

### 6 · La solución — 5 bloques de beneficio

**01 · Tu anamnesis, en una sola pasada**
Dictas o pegas tus notas de consulta y sale el documento clínico ordenado, con tu estructura y tu criterio. No el de una plantilla genérica: el tuyo.

**02 · Cálculos con tus propias fórmulas**
Construyes tu calculadora de requerimientos, antropometría y clasificación con los criterios que tú usas. Deja de pedir prestada la planilla de otra persona.

**03 · Minutas y planes editables**
Generas la base en segundos y solo ajustas. Se acabó empezar cada plan desde una hoja en blanco.

**04 · Seguimiento que no se te pierde**
Una planilla viva por paciente: peso, medidas, adherencia y evolución en un solo lugar, lista para la consulta de control.

**05 · Prompts de IA con criterio clínico**
La parte que casi nadie enseña: cómo se le habla a la IA para que no invente, no diagnostique y no se salga de tu marco profesional.

### 7 · Qué te llevas al final

- **Tus herramientas funcionando y a tu nombre.** No una licencia ni un acceso que se vence: un producto tuyo.
- **El método para construir la siguiente.** Cuando cambie tu enfoque, no dependes de nadie para adaptarlas.
- **Criterio sobre qué NO se automatiza.** Dónde termina la herramienta y empieza el juicio clínico. Esto es lo que separa a un profesional de un usuario de IA.
- **Acceso inmediato a la masterclass grabada.** No esperas al taller para empezar.

### 8 · CTA de cierre con autoridad

> **Pedro Barrera** — Nutricionista Dietista · +1.000 pacientes en nutrición clínica y deportiva.
>
> Estas herramientas no las diseñé para vender una formación. Las diseñé para sobrevivir mis días de consulta. Funcionaron tan bien que decidí enseñar a otros nutricionistas a construir las suyas.
>
> **Registrarme al taller gratis**

### 9 · FAQ

**¿Necesito saber de tecnología o programar?**
No. Nada de código. Todo se explica en lenguaje de consulta, no de programador. Si manejas un documento de texto y WhatsApp, tienes lo que se necesita.

**¿Me van a entregar las herramientas ya hechas?**
No, y esa es toda la diferencia. Una herramienta prestada deja de servirte el día que cambias de enfoque. Aquí aprendes a diseñar las tuyas, y lo que construyes queda como producto propio.

**Soy escéptico con la IA en salud. ¿Esto es confiable?**
Deberías serlo. La IA no diagnostica ni decide: tú diagnosticas y tú decides. Lo que hace es escribir, ordenar y calcular lo que ya definiste. Parte del taller es justamente marcar ese límite, porque la responsabilidad clínica sigue siendo tuya.

**¿Cuándo es el taller y cuánto cuesta?**
El taller en vivo es gratuito. La fecha se anuncia por correo y por WhatsApp a quienes estén registrados. Al registrarte hoy recibes de inmediato la masterclass grabada, así que no tienes que esperar para empezar.

### 10 · Formulario

**Encabezado:** Registro al taller
**Campos:** Nombre y apellido · Correo electrónico · WhatsApp (opcional)
**Botón:** Registrarme al taller gratis
**Microcopy:** Es gratis. Recibes el acceso a la masterclass en tu correo, y el aviso del taller en vivo cuando se abra la fecha.

**Estado de éxito:**

> **Registro confirmado**
> Revisa tu correo: ahí está el acceso a la masterclass grabada. Te aviso por ese mismo medio cuando se abra la fecha del taller en vivo.

---

## C. Notas de implementación

- La página vive en `public/index.html` y se publica con Cloudflare (`wrangler.jsonc` sirve `./public` tal cual).
- Para conectar el formulario: poner la URL del proveedor en `action=""` del `<form id="reg-form">` y ajustar los `name=` si el proveedor los exige distintos (`nombre`, `email`, `whatsapp`).
- Imagen para compartir: subir `public/og.jpg` de 1200×630 px y descomentar la etiqueta `og:image` del `<head>`.
