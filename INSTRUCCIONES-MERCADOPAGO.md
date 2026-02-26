# 🎨 Instrucciones: Integración de Mercado Pago

## ✅ Implementación Completada

La integración de Mercado Pago está completa y lista para usar. Incluye:

- ✨ Checkout Pro profesional
- 🎟️ Generación automática de códigos de cuponera
- 💬 Redirección a WhatsApp con el código
- 🎯 Páginas de éxito/error con buena estética
- 📱 Diseño responsive

---

## 🔐 Paso 1: Obtener tus Credenciales de TEST

### Para probar AHORA (con pagos falsos):

1. **Entrá a:** https://www.mercadopago.com.ar/developers/panel
2. **Iniciá sesión** con tu cuenta de Mercado Pago (o creá una gratis)
3. **Creá una aplicación:**
   - Click en "Crear aplicación"
   - Nombre: "Naik Dance Pagos"
   - Elegí: "Pagos online"
4. **Copiá las credenciales de TEST:**
   - En el panel, andá a "Credenciales"
   - Click en la pestaña **"Credenciales de prueba"**
   - Copiá:
     - `Public Key` (empieza con `TEST-`)
     - `Access Token` (empieza con `TEST-`)

---

## ⚙️ Paso 2: Configurar el proyecto

### Creá el archivo `.env.local` en la raíz del proyecto:

```bash
# En la carpeta naikdance-web/, creá .env.local con:

NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-tu-public-key-aqui
MP_ACCESS_TOKEN=TEST-tu-access-token-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Ejemplo:**
```bash
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-12345678-abcd-1234-abcd-123456789abc
MP_ACCESS_TOKEN=TEST-1234567890123456-012345-abcdefgh12345678ijklmnop12345678-123456789
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🧪 Paso 3: Probar pagos de TEST

### 1. Reiniciá el servidor:
```bash
npm run dev
```

### 2. Usá estas tarjetas de prueba:

#### ✅ **Pago Aprobado:**
- **Número:** `4509 9535 6623 3704`
- **CVV:** `123`
- **Vencimiento:** Cualquier fecha futura
- **Nombre:** Cualquiera

#### ❌ **Pago Rechazado:**
- **Número:** `4000 0000 0000 0002`

#### ⏳ **Pago Pendiente:**
- **Número:** `4000 0000 0000 0010`

### 3. Datos del comprador (cualquier cosa):
- Email: `test@test.com`
- DNI: `12345678`

---

## 🚀 Paso 4: Pasar a PRODUCCIÓN

### Cuando el dueño esté listo para recibir pagos REALES:

1. **El dueño debe:**
   - Entrar a https://www.mercadopago.com.ar/developers/panel
   - Ir a su aplicación "Naik Dance Pagos"
   - Click en **"Credenciales de producción"**
   - Copiar las credenciales (SIN el prefijo `TEST-`)

2. **Actualizá `.env.local`:**
```bash
# Reemplazá TEST- por las credenciales reales
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-tu-public-key-real
MP_ACCESS_TOKEN=APP_USR-tu-access-token-real
NEXT_PUBLIC_SITE_URL=https://naikdance.com
```

3. **En Vercel, agregá las variables de entorno:**
   - Andá a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agregá las 3 variables
   - Redesplegá el sitio

---

## 💰 Precios Configurados

Los precios incluyen la comisión de Mercado Pago (~5%):

| Producto | Efectivo | Transferencia | Mercado Pago |
|----------|----------|---------------|--------------|
| Pack X2 | $12.000 | $12.500 | $12.600 |
| Pack X3 | $18.000 | $18.500 | $18.900 |
| Pack X4 | $24.000 | $24.500 | $25.200 |
| 1 Hora | $7.000 | $7.500 | $7.350 |
| 1:30 min | $8.500 | $9.000 | $8.925 |
| 4 Clases | $20.900 | $21.500 | $21.945 |
| 8 Clases | $25.900 | $26.500 | $27.195 |
| 12 Clases | $34.900 | $35.500 | $36.645 |
| 16 Clases | $46.900 | $47.500 | $49.245 |
| Pase Full | $79.900 | $80.500 | $83.895 |
| Universal | $89.900 | $90.500 | $94.395 |

---

## 🎟️ Códigos de Cuponera

Cada pago genera un código único automáticamente:

**Formato:** `NAIK-[TIPO]-[RANDOM]`

**Ejemplos:**
- `NAIK-4C-A7B3` (4 clases)
- `NAIK-8C-X9K2` (8 clases)
- `NAIK-FULL-M4P1` (Pase Full)

---

## 📱 Flujo de Pago

1. Cliente hace click en "Mercado Pago"
2. Se abre el checkout de Mercado Pago
3. Cliente paga con tarjeta/débito
4. Vuelve al sitio → ve su código de cuponera
5. Se redirige a WhatsApp automáticamente
6. Mensaje incluye el código

---

## 🔒 Seguridad

- ✅ Las credenciales están en `.env.local` (no se suben a GitHub)
- ✅ El Access Token solo está en el servidor
- ✅ Los pagos son procesados por Mercado Pago
- ✅ El sitio nunca ve datos de tarjetas

---

## ❓ Problemas Comunes

### Error: "Missing credentials"
→ Revisá que el archivo `.env.local` exista y tenga las credenciales

### Error: "Invalid access token"
→ Verificá que copiaste el token completo (son muy largos)

### El checkout no se abre
→ Revisá la consola del navegador (F12) para ver errores

### Pagos de prueba no funcionan
→ Usá SOLO tarjetas de prueba de Mercado Pago

---

## 📞 Soporte

Si tenés problemas:
- Documentación oficial: https://www.mercadopago.com.ar/developers
- Soporte: https://www.mercadopago.com.ar/ayuda

---

## ✨ Mejoras Futuras (Opcionales)

- [ ] Email de confirmación automático
- [ ] Panel de admin para ver pagos
- [ ] Validación de códigos al reservar
- [ ] Webhooks para pagos pendientes
- [ ] Descuentos/cupones

---

🎉 **¡Listo para probar!**
