# Configuración para el cliente – Naik Dance Web

Esta guía detalla **todo lo que tenés que completar** para usar la web con **tu** WhatsApp y **tu** Mercado Pago, reemplazando las configuraciones del desarrollador.

---

## Resumen: qué tenés que configurar

| Qué | Dónde | Para qué |
|-----|--------|----------|
| **Número de WhatsApp** | Variable de entorno | Que todos los botones "WhatsApp" y "Abrir Chat" abran un chat con **tu** número |
| **Credenciales de Mercado Pago** | Variables de entorno | Que los pagos (clases, packs, cuponeras) entren a **tu** cuenta de Mercado Pago |
| **Webhook de Mercado Pago** | Panel de desarrolladores MP | Que cuando alguien pague, la web confirme la reserva automáticamente |
| **URL del sitio** | Variable de entorno | Para que los links de éxito/error y el webhook apunten a tu dominio |

Las variables se configuran en:

- **Local:** archivo `.env.local` en la raíz del proyecto
- **Producción (Vercel):** Settings → Environment Variables del proyecto

---

## 1. WhatsApp

### Qué hace la web con WhatsApp

- Enlaces **wa.me** que abren WhatsApp (app o web) con un mensaje opcional.
- No se usa API de WhatsApp: solo links. No hace falta WhatsApp Business API.

### ¿WhatsApp normal o WhatsApp Business?

- **Para los links wa.me es lo mismo.**  
  Tanto si usás **WhatsApp** como **WhatsApp Business**, el link es el mismo: `https://wa.me/TUNUMERO`.  
  Solo cambia el número que pongas; el formato y los pasos son idénticos.

### Paso a paso: usar tu número

1. **Número con código de país, sin + ni espacios**  
   Ejemplos:
   - Argentina (11 1234-5678): `5491112345678`
   - Argentina (15 1234-5678): `5491112345678` (el 15 se reemplaza por 9 después del 54)
   - Otro país: código país + número. Ej. México: `5215512345678`

2. **Variable de entorno**  
   En `.env.local` (y en Vercel → Environment Variables) agregá:

   ```bash
   NEXT_PUBLIC_WHATSAPP_NUMBER=5491112345678
   ```

   Reemplazá `5491112345678` por **tu** número en ese formato.

3. **Guardar y desplegar**  
   - Local: guardá `.env.local` y reiniciá `npm run dev`.  
   - Vercel: agregá la variable, guardá y volvé a desplegar el proyecto.

Después de esto, todos los botones de WhatsApp de la web (Contacto, Footer, Horarios, Aranceles, reservas, pago exitoso/fallido, etc.) usarán **tu** número. No hace falta tocar código.

---

## 2. Mercado Pago

La web usa **Checkout Pro** de Mercado Pago: el usuario paga en la página de Mercado Pago y después vuelve a tu sitio. Los pagos entran a la cuenta de Mercado Pago que uses en las credenciales.

### Paso 1: Entrar al panel de desarrolladores

1. Entrá a: **https://www.mercadopago.com.ar/developers/panel**
2. Iniciá sesión con **tu** cuenta de Mercado Pago (la que quieras que reciba el dinero).

### Paso 2: Crear una aplicación

1. Clic en **"Crear aplicación"**.
2. Nombre: por ejemplo **"Naik Dance Pagos"**.
3. Tipo: **"Pagos online"** (o la opción que permita Checkout / pagos en línea).
4. Guardá.

### Paso 3: Credenciales de prueba (para probar sin cobrar de verdad)

1. En la app creada, entrá a **"Credenciales"**.
2. Pestaña **"Credenciales de prueba"**.
3. Copiá:
   - **Public Key** (empieza con `TEST-`).
   - **Access Token** (empieza con `TEST-`).

En local podés usar estas dos en `.env.local` para probar con tarjetas de prueba de Mercado Pago (no se cobra dinero real).

### Paso 4: Credenciales de producción (para cobrar de verdad)

1. En la misma app, pestaña **"Credenciales de producción"**.
2. Si te pide completar datos de negocio, completalos.
3. Copiá:
   - **Public Key** (empieza con `APP_USR-`).
   - **Access Token** (empieza con `APP_USR-`).

Estas son las que tenés que usar en **producción** (Vercel) para que el dinero entre a tu cuenta.

### Paso 5: Variables de entorno de Mercado Pago

En `.env.local` y en **Vercel → Environment Variables**:

```bash
# Mercado Pago – reemplazá por tus valores
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxx...
MP_ACCESS_TOKEN=APP_USR-xxxxxxxx...

# URL de tu sitio (necesaria para éxito/error y webhook)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

- **Local / pruebas:** podés usar las credenciales **TEST** y `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- **Producción:** usá las credenciales **de producción** y `NEXT_PUBLIC_SITE_URL` con tu dominio real (ej. `https://naikdance.com`).

### Paso 6: Webhook (notificaciones de pago)

Para que cuando alguien pague, la web marque la reserva como confirmada automáticamente:

1. En el panel de desarrolladores: tu app → **Webhooks** (o "Notificaciones").
2. **Agregar URL de notificación:**
   - URL: `https://tu-dominio.com/api/mercadopago/webhook`  
     (reemplazá `tu-dominio.com` por tu dominio real).
3. Eventos: al menos **Pagos** / **payment**.
4. Guardá.

Si Mercado Pago te muestra un **secret** o **clave secreta** del webhook, copialo y agregalo como variable de entorno:

```bash
MP_WEBHOOK_SECRET=el_valor_que_te_da_mercadopago
```

En Vercel agregá la misma variable. Así la web valida que las notificaciones vengan realmente de Mercado Pago. Si no configurás `MP_WEBHOOK_SECRET`, el webhook sigue funcionando pero sin validación de firma (menos seguro en producción).

---

## 3. Lista de variables de entorno

Todo lo que el cliente debe definir (sin valores del desarrollador):

| Variable | Obligatoria | Dónde se usa |
|----------|-------------|--------------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sí (para tu WhatsApp) | Todos los enlaces wa.me de la web |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Sí (para pagos) | Checkout Pro en el navegador |
| `MP_ACCESS_TOKEN` | Sí (para pagos) | Crear preferencias de pago y webhook en el servidor |
| `NEXT_PUBLIC_SITE_URL` | Sí | Links de retorno y URL del webhook |
| `MP_WEBHOOK_SECRET` | Recomendada en producción | Validar que el webhook sea de Mercado Pago |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí (si usás reservas) | Conexión a Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí (si usás reservas) | Conexión a Supabase |

Para Supabase, si ya te dieron un proyecto, los valores están en el dashboard de Supabase → Settings → API. Si no, seguí la guía `SETUP-SUPABASE.md`.

---

## 4. Orden recomendado

1. **WhatsApp:** definir `NEXT_PUBLIC_WHATSAPP_NUMBER` en `.env.local` y en Vercel.
2. **Mercado Pago:** crear la aplicación, copiar credenciales de producción, configurar `NEXT_PUBLIC_MP_PUBLIC_KEY`, `MP_ACCESS_TOKEN` y `NEXT_PUBLIC_SITE_URL`.
3. **Webhook:** configurar la URL del webhook en el panel de MP y, si te dan secret, `MP_WEBHOOK_SECRET`.
4. **Probar:** un pago de prueba en producción y revisar que la reserva se confirme y que los links de WhatsApp abran tu número.

Con esto reemplazás por completo las configuraciones del desarrollador (WhatsApp y Mercado Pago) por las tuyas.
