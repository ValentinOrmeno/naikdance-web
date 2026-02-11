# 📸 Configuración de Instagram Feed

## 🚀 Sistema Implementado

Tu sitio ahora trae automáticamente las últimas 6 publicaciones de Instagram usando la **Instagram Basic Display API**.

### ✨ Características:
- ✅ Actualización automática cada hora
- ✅ Caché inteligente (rápido y eficiente)
- ✅ Imágenes reales de Instagram
- ✅ Fallback automático (si falla, muestra posts de ejemplo)
- ✅ Diseño custom mantenido

---

## 📋 Configuración (Paso a Paso)

### **OPCIÓN 1: Sin configurar (Funciona YA)** ⚡

Por defecto, el sistema muestra 6 posts de ejemplo con imágenes profesionales de Unsplash.

✅ **Ya funciona** sin hacer nada
✅ Se ve profesional
⚠️ No son tus posts reales de Instagram

---

### **OPCIÓN 2: Conectar Instagram Real** 🎯

Para mostrar TUS posts reales de Instagram:

#### **Paso 1: Crear App de Facebook**

1. Andá a: https://developers.facebook.com/apps/create/
2. Seleccioná **"Consumer"**
3. Dale un nombre: "NAIK Dance Feed"
4. Click en **"Create App"**

#### **Paso 2: Agregar Instagram Basic Display**

1. En tu app, buscá **"Instagram Basic Display"**
2. Click en **"Set Up"**
3. Completá:
   - **Valid OAuth Redirect URIs**: `https://localhost/`
   - **Deauthorize Callback URL**: `https://naikdance-web.vercel.app/`
   - **Data Deletion Request URL**: `https://naikdance-web.vercel.app/`
4. Guardá cambios

#### **Paso 3: Agregar Usuario de Prueba**

1. En **"Roles" → "Instagram Testers"**
2. Click en **"Add Instagram Testers"**
3. Ingresá el nombre de usuario de **@naik.danceestudio**
4. Abrí Instagram, andá a **Configuración → Apps y sitios web → Invitaciones de probador**
5. Aceptá la invitación

#### **Paso 4: Generar Access Token**

1. En tu app de Facebook, andá a **"Basic Display" → "User Token Generator"**
2. Click en **"Generate Token"** al lado del usuario de Instagram
3. Autorizá la app desde Instagram
4. **Copiá el token** (algo como `IGQVJXa2c4...`)

#### **Paso 5: Configurar Variable de Entorno**

1. Abrí tu archivo `.env.local`
2. Agregá esta línea:

```bash
INSTAGRAM_ACCESS_TOKEN=IGQVJXa2c4... (tu token acá)
```

3. **Guardá el archivo**
4. **Reiniciá el servidor**: `npm run dev`

#### **Paso 6: Verificar**

1. Abrí http://localhost:3000
2. Scrolleá hasta la sección "Seguinos en Instagram"
3. ✅ Deberías ver TUS posts reales

---

## 🔄 Renovar Token (Cada 60 días)

Los tokens de Instagram Basic Display expiran cada 60 días.

### **Renovación Automática**

Creá un endpoint que renueve el token automáticamente:

```bash
GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={tu-token}
```

### **Renovación Manual**

1. Volvé al paso 4 de configuración
2. Generá un nuevo token
3. Actualizá `.env.local`
4. Redeploy en Vercel

---

## 🚀 Deploy a Vercel

Para que funcione en producción:

1. Andá a tu proyecto en Vercel
2. **Settings → Environment Variables**
3. Agregá:
   ```
   INSTAGRAM_ACCESS_TOKEN = (tu token)
   ```
4. **Redeploy**

---

## ❓ Troubleshooting

### "No aparecen mis posts"
- ✅ Verificá que el token esté en `.env.local`
- ✅ Reiniciá el servidor (`npm run dev`)
- ✅ Verificá que el usuario sea "Instagram Tester" en Facebook

### "Token expirado"
- Renovalo siguiendo los pasos de "Renovación Manual"

### "Error en consola"
- Revisá que el token no tenga espacios extra
- Verificá que la app esté en modo "Live" (no Development)

---

## 📊 Métricas Actuales

- ✅ **Caché**: 1 hora (actualización automática)
- ✅ **Revalidación**: ISR de Next.js
- ✅ **Fallback**: Posts de ejemplo profesionales
- ✅ **Performance**: Optimizado con Image de Next.js

---

## 🎨 Personalización

Si querés cambiar el diseño, editá:
- **Componente**: `src/components/InstagramFeed.tsx`
- **API**: `src/app/api/instagram/route.ts`

---

## 💡 Alternativas

Si no querés configurar Instagram API, el sistema **ya funciona** con posts de ejemplo.

También podés:
- Usar Juicer.io (widget externo)
- Actualizar manualmente los posts
- Conectar a otro servicio de terceros

---

**¿Dudas?** El sistema está listo para usar con o sin configuración adicional. 🚀
