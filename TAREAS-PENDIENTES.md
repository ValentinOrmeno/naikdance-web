# 📋 TAREAS PENDIENTES - Naik Dance Web

## ✅ COMPLETADO

- [x] Sitio web funcionando en Vercel
- [x] Diseño responsive (móvil, tablet, desktop)
- [x] Staff completo (21 profes)
- [x] Galería de clases con fotos
- [x] Sistema de pagos Mercado Pago preparado
- [x] Headers de seguridad HTTP
- [x] SEO optimizado (meta tags, sitemap, schema.org)
- [x] Google Search Console verificado
- [x] Sitemap enviado a Google
- [x] Robots.txt configurado
- [x] **Sistema de reservas con disponibilidad y cupos por profesor**
  - Calendario dinámico (navega entre meses)
  - Cupos configurables por profe
  - Días disponibles editables
  - Ver: `COMO-EDITAR-DISPONIBILIDAD.md`

---

## ⏳ PENDIENTE - Para cuando la página esté lista

### 🔥 PRIORIDAD ALTA (Hacer PRIMERO)

#### 1. Google My Business (MUY IMPORTANTE)
**Por qué:** Esto hace que aparezcas en "clases de baile cerca de mí" y Google Maps

**Pasos:**
1. Ir a: https://business.google.com
2. Buscar "Naik Dance Studio" (ya está en Maps)
3. Reclamar el perfil
4. Actualizar datos:
   - ✅ Link del sitio: `https://naikdance-web.vercel.app`
   - ✅ Horarios: Lun-Vie 17:00-22:00, Sáb 10:00-18:00
   - ✅ Teléfono: 11-6858-2586
   - ✅ Categorías: "Escuela de baile", "Academia de danza"
5. Subir MÍNIMO 10 fotos:
   - Logo
   - Fotos del estudio
   - Fotos de clases
   - Fotos del staff
6. Verificar (carta por correo o teléfono)

**Tiempo estimado:** 30 minutos + 5-10 días de verificación

---

#### 2. Conseguir Reseñas de Google (CLAVE para SEO local)
**Por qué:** Negocios con reseñas aparecen MUCHO más arriba en Google

**Pasos:**
1. Una vez verificado Google My Business
2. Pedir a 10-15 alumnos que dejen reseña
3. Google te da un link directo para compartir
4. Enviarlo por WhatsApp a los alumnos
5. Meta: 10+ reseñas de 5 estrellas

**Tiempo estimado:** 1-2 semanas

---

#### 3. Configurar Disponibilidad de Profes (Para calendario de reservas)
**Estado actual:** 2 profes tienen disponibilidad de ejemplo (Fran Benitez y Giuli Grimaldi)

**Pasos:**
1. Abrir: `src/data/teachers.ts`
2. Para cada profe, agregar sección `availability` (ver ejemplos en el archivo)
3. Definir días disponibles por mes
4. Definir cupos por clase
5. Actualizar `reservas` cuando alguien reserve

**Guía completa:** Ver archivo `COMO-EDITAR-DISPONIBILIDAD.md`

**Tiempo estimado:** 5 minutos por profe

---

#### 4. Links de Mercado Pago (Para activar pagos)
**Estado actual:** Botones preparados pero sin links reales

**Pasos:**
1. Pedir al dueño que cree los links de pago en Mercado Pago para:
   - Pack Mensual x2 ($12.500)
   - Pack Mensual x3 ($18.500)
   - Pack Mensual x4 ($24.500)
   - Clase Suelta 1h ($7.500)
   - Clase Suelta 1.5h ($9.000)
   - Cuponera 4 clases ($21.500)
   - Cuponera 8 clases ($26.500)
   - Cuponera 12 clases ($35.500)
   - Cuponera 16 clases ($47.500)
   - Pase Full ($80.500)
   - Universal ($90.500)

2. Pasarme los links (formato: `https://mpago.la/xxxxx`)
3. Yo los agrego al código (5 minutos)

**Tiempo estimado:** 30 minutos del dueño + 5 minutos míos

---

### 🔶 PRIORIDAD MEDIA (Hacer después)

#### 4. Google Analytics 4 (Para ver estadísticas)
**Por qué:** Ver cuánta gente entra, de dónde vienen, qué páginas visitan

**Pasos:**
1. Ir a: https://analytics.google.com
2. Crear cuenta → Propiedad: "Naik Dance"
3. Te dan un ID como: `G-XXXXXXXXXX`
4. Pasármelo
5. Yo lo activo en 30 segundos

**Tiempo estimado:** 15 minutos + 30 segundos míos

---

#### 5. Redes Sociales (Backlinks)
**Por qué:** Google valora que tengas presencia en redes

**Estado actual:**
- ✅ Instagram: https://www.instagram.com/naikdance/ (configurado en el sitio)

**Pasos:**
1. Instagram: Agregar link en bio → `https://naikdance-web.vercel.app`
2. (Opcional) Facebook: Crear página con link al sitio
3. (Opcional) TikTok: Crear cuenta y agregar link en bio
4. (Opcional) YouTube: Si tienen videos, link en descripción

**Tiempo estimado:** 5 minutos (Instagram) + 30 minutos si crean más redes

---

#### 6. Directorios Locales (Backlinks adicionales)
**Por qué:** Más menciones en internet = mejor posicionamiento

**Registrarse en:**
- [ ] PaginasAmarillas.com.ar
- [ ] Guía Clarín
- [ ] Directorios de danza/actividades en Moreno
- [ ] Páginas de eventos/cultura locales

**Tiempo estimado:** 1 hora

---

### 🔵 PRIORIDAD BAJA (Opcional - Largo plazo)

#### 7. Dominio Propio (Opcional)
**Estado actual:** `naikdance-web.vercel.app` funciona perfecto

**Si querés:** `naikdance.com` o `naikdance.com.ar`

**Pasos:**
1. Comprar dominio (Namecheap, GoDaddy, NIC Argentina)
2. Precio: ~$10-15 USD/año (.com) o ~$2000-3000 ARS/año (.com.ar)
3. Conectarlo en Vercel (5 minutos)
4. Yo actualizo las 3 líneas del sitemap

**Tiempo estimado:** 30 minutos + $10-15 USD/año

---

#### 8. Blog/Contenido (Para SEO a largo plazo)
**Por qué:** Contenido = más palabras clave = más tráfico de Google

**Ideas de posts:**
- "5 beneficios de bailar reggaeton"
- "Cómo elegir tu primer clase de danza urbana"
- "Diferencia entre Hip Hop y Urbano"
- "Qué ropa usar para clases de baile"
- "Por qué bailar es bueno para tu salud mental"

**Tiempo estimado:** 1-2 horas por post

---

## 📊 TIMELINE ESTIMADO

### Semana 1-2:
- [ ] Google My Business reclamado y verificado
- [ ] Primeras 5 reseñas conseguidas
- [ ] Links de Mercado Pago agregados

### Semana 3-4:
- [ ] 10+ reseñas en Google
- [ ] Google Analytics configurado
- [ ] Links en redes sociales

### Mes 2-3:
- [ ] Aparecer en top 5 de "clases de baile moreno"
- [ ] Directorios locales completados

### Mes 3-6:
- [ ] Top 3 en búsquedas locales
- [ ] 20+ reseñas
- [ ] Blog con 3-5 posts (opcional)

---

## 🎯 IMPACTO DE CADA TAREA

| Tarea | Impacto SEO | Dificultad | Tiempo |
|-------|-------------|------------|--------|
| Google My Business | 🔥🔥🔥🔥🔥 | Fácil | 30 min |
| Reseñas de Google | 🔥🔥🔥🔥🔥 | Fácil | 1-2 semanas |
| Links Mercado Pago | 💰💰💰💰💰 | Fácil | 30 min |
| Google Analytics | 📊📊📊 | Muy fácil | 15 min |
| Redes sociales | 🔥🔥🔥 | Fácil | 30 min |
| Directorios locales | 🔥🔥 | Media | 1 hora |
| Dominio propio | 🔥 | Fácil | 30 min |
| Blog/Contenido | 🔥🔥🔥 | Media | 2h/post |

---

## 📞 CUANDO ESTÉ TODO LISTO

Avisame y hacemos el deploy final con:
- ✅ Links de Mercado Pago
- ✅ Google Analytics ID (si lo tenés)
- ✅ Cualquier ajuste de último momento

---

## 💡 RECORDATORIOS

- **Google My Business = 80% del éxito en SEO local**
- **Reseñas = Factor #1 para aparecer primero**
- **El sitemap ya está enviado → Google indexará en 1-2 semanas automáticamente**
- **Todo el código SEO ya está implementado → Solo falta la parte "fuera del sitio"**

---

¿Dudas? Revisá el archivo `SEO-GUIDE.md` para instrucciones detalladas paso a paso.
