# 🗄️ Setup de Supabase - Sistema de Reservas Automático

## PASO 1: Esperar que se cree el proyecto
⏳ Tarda 2-3 minutos. Cuando veas el dashboard, continúa.

---

## PASO 2: Ejecutar el Schema SQL

1. En el dashboard de Supabase, click en **"SQL Editor"** (icono de base de datos en la barra lateral)
2. Click en **"New Query"**
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. **Copia TODO el contenido** del archivo
5. **Pega** en el editor SQL de Supabase
6. Click en **"Run"** (abajo a la derecha)
7. Deberías ver: ✅ "Success. No rows returned"

Esto crea:
- ✅ Tabla `availability` (disponibilidad de profes)
- ✅ Tabla `reservations` (reservas de alumnos)
- ✅ Índices (para que sea rápido)
- ✅ Triggers (actualización automática de timestamps)
- ✅ Datos iniciales (Fran y Giuli ya tienen disponibilidad)
- ✅ Políticas de seguridad (RLS)

---

## PASO 3: Obtener las Credenciales

1. En el dashboard, click en **"Settings"** (⚙️ abajo a la izquierda)
2. Click en **"API"**
3. Verás 2 valores importantes:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### anon/public key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
```

---

## PASO 4: Agregar Variables de Entorno

1. Abre (o crea) el archivo `.env.local` en la raíz del proyecto
2. Agrega estas líneas:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mercado Pago (ya las tenías)
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxx
MP_ACCESS_TOKEN=APP_USR-xxxxx
NEXT_PUBLIC_SITE_URL=https://naikdance.com
```

3. **Guarda** el archivo

---

## PASO 5: Reiniciar el Servidor

En la terminal:
```bash
# Detener el servidor actual (Ctrl+C)
# Iniciar de nuevo
npm run dev
```

---

## PASO 6: Agregar Variables en Vercel (Para Producción)

1. Abre: https://vercel.com/
2. Entra a tu proyecto "naikdance-web"
3. Click en **"Settings"**
4. Click en **"Environment Variables"**
5. Agrega las 2 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu key
6. Click en **"Save"**
7. Ve a **"Deployments"**
8. Click en los **3 puntos** del último deploy → **"Redeploy"**

---

## ✅ LISTO!

Ahora el sistema:
- ✅ Lee cupos en tiempo real de Supabase
- ✅ Guarda reservas en la BD
- ✅ Actualiza cupos automáticamente cuando confirmes
- ✅ Panel admin para gestionar todo

---

## 🔐 SEGURIDAD

- Las credenciales son **públicas** (NEXT_PUBLIC_) pero está bien
- Supabase tiene RLS (Row Level Security) activado
- Solo permitimos lectura y creación de reservas
- La confirmación requiere autenticación (panel admin)

---

## 📞 SIGUIENTE PASO

Cuando termines estos pasos, avisame y te muestro:
1. Cómo probar que funciona
2. El panel admin para confirmar reservas
3. Cómo migrar todos los profes a Supabase
