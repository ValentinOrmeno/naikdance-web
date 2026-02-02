# 🔒 Seguridad - Naik Dance Web

## ✅ Medidas de Seguridad Implementadas

### 1. **Headers de Seguridad HTTP**

Configurados en `next.config.ts`:

```
✅ X-Content-Type-Options: nosniff
   → Previene ataques MIME type sniffing

✅ X-Frame-Options: SAMEORIGIN
   → Previene clickjacking (embeber sitio en iframes maliciosos)

✅ X-XSS-Protection: 1; mode=block
   → Protección contra Cross-Site Scripting (XSS)

✅ Referrer-Policy: strict-origin-when-cross-origin
   → Controla qué información se comparte al hacer click en links

✅ Permissions-Policy: camera=(), microphone=(), geolocation=()
   → Bloquea acceso no autorizado a hardware del dispositivo
```

---

### 2. **Sanitización de Datos**

#### URLs de WhatsApp:
```typescript
// ✅ CORRECTO - Sanitizado
const message = `Hola soy ${userName}`;
const url = `https://wa.me/54911...?text=${encodeURIComponent(message)}`;
```

**Protege contra:**
- Inyección de código en URLs
- Caracteres especiales que rompen la URL
- XSS a través de parámetros

---

### 3. **Next.js Built-in Security**

Next.js incluye por defecto:
- ✅ Protección CSRF
- ✅ Sanitización automática de JSX
- ✅ Escape automático de strings
- ✅ Environment variables seguras (NEXT_PUBLIC_*)

---

### 4. **Imágenes Optimizadas**

```typescript
// ✅ Uso de next/image (optimizado y seguro)
import Image from 'next/image';
```

**Beneficios:**
- Lazy loading automático
- Optimización de tamaño
- Prevención de Cumulative Layout Shift (CLS)
- No expone rutas de archivos directamente

---

### 5. **No Hay Datos Sensibles en el Frontend**

✅ No hay:
- API keys en el código
- Contraseñas hardcodeadas
- Tokens de acceso
- Datos de pago (usa Mercado Pago externo)

---

## ⚠️ Vulnerabilidades Comunes - VERIFICADAS Y PREVENIDAS

### ❌ XSS (Cross-Site Scripting)
**Estado:** ✅ **PROTEGIDO**
- Uso de `encodeURIComponent()` en todas las URLs
- React/Next.js escapa automáticamente el contenido
- No hay `dangerouslySetInnerHTML` en inputs de usuario

### ❌ SQL Injection
**Estado:** ✅ **NO APLICA**
- No hay base de datos
- Datos estáticos en archivos TypeScript

### ❌ CSRF (Cross-Site Request Forgery)
**Estado:** ✅ **PROTEGIDO**
- Next.js protege automáticamente
- No hay formularios de autenticación

### ❌ Clickjacking
**Estado:** ✅ **PROTEGIDO**
- Header `X-Frame-Options: SAMEORIGIN`

### ❌ Open Redirect
**Estado:** ✅ **PROTEGIDO**
- Solo redirecciones a dominios controlados:
  - WhatsApp oficial (wa.me)
  - Mercado Pago oficial

---

## 🔐 HTTPS / SSL

### En Producción (Vercel):
✅ **HTTPS automático**
- Certificado SSL gratuito
- Renovación automática
- Redirección HTTP → HTTPS

### En Desarrollo (localhost):
⚠️ HTTP (normal para desarrollo)

---

## 🛡️ Mejoras Futuras (Opcionales)

### Si el sitio crece mucho:

1. **Rate Limiting**
   - Limitar requests por IP
   - Prevenir spam en formularios

2. **Content Security Policy (CSP)**
   ```typescript
   'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:;"
   ```

3. **HSTS (HTTP Strict Transport Security)**
   ```typescript
   'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
   ```

4. **Captcha en Formularios**
   - Google reCAPTCHA v3
   - Prevenir bots

---

## 📊 Testing de Seguridad

### Herramientas para probar:

1. **Security Headers**
   - https://securityheaders.com/
   - Escanea headers HTTP

2. **Mozilla Observatory**
   - https://observatory.mozilla.org/
   - Análisis completo de seguridad

3. **SSL Labs**
   - https://www.ssllabs.com/ssltest/
   - Test de certificado SSL

---

## ✅ Checklist de Seguridad

- [x] Headers de seguridad configurados
- [x] URLs sanitizadas con `encodeURIComponent()`
- [x] No hay `eval()`, `innerHTML` o código peligroso
- [x] Imágenes optimizadas con `next/image`
- [x] No hay API keys expuestas
- [x] HTTPS en producción (Vercel)
- [x] Dependencies actualizadas
- [x] No hay `console.log()` con datos sensibles
- [x] LocalStorage solo para datos no sensibles

---

## 🚨 Qué NO hacer

### ❌ NUNCA:
```typescript
// MAL - XSS vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// MAL - Open redirect
window.location = userInput;

// MAL - Eval de código
eval(userInput);

// MAL - API key expuesta
const API_KEY = "abc123..."; // ❌
```

### ✅ SIEMPRE:
```typescript
// BIEN - React escapa automáticamente
<div>{userInput}</div>

// BIEN - URL controlada
window.location.href = `https://wa.me/...?text=${encodeURIComponent(userInput)}`;

// BIEN - Usar .env para secrets
const API_KEY = process.env.API_KEY; // ✅
```

---

## 📞 Reporte de Vulnerabilidades

Si encontrás alguna vulnerabilidad:
1. NO la publiques públicamente
2. Contactá al equipo de desarrollo
3. Describí el problema y cómo reproducirlo

---

## ✅ Conclusión

**Nivel de Seguridad Actual: 🟢 BUENO**

Para una academia de baile sin:
- Login de usuarios
- Pagos directos (usa MP externo)
- Datos sensibles
- Base de datos

**Las medidas implementadas son MÁS que suficientes.**

La web es segura para uso en producción. 🚀
