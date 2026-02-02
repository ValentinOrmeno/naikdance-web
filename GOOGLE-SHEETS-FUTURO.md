# 📊 Sistema de Cupos con Google Sheets - Guía Futura

## ⚠️ SOLO IMPLEMENTAR SI:
- Tienen 50+ reservas por mes
- Actualizar manual se vuelve tedioso
- El cliente lo pide específicamente

---

## 🎯 PARTE 1: CREAR LA PLANILLA (Fácil - 10 minutos)

### **Qué hacer:**

1. **Crear Google Sheet** llamada "Naik Dance - Disponibilidad"

2. **Estructura de la planilla:**

| Profesor | Mes | Día | Cupos | Reservas | Disponible |
|----------|-----|-----|-------|----------|------------|
| Fran Benitez | 2026-02 | 4 | 15 | 3 | 12 |
| Fran Benitez | 2026-02 | 6 | 15 | 5 | 10 |
| Fran Benitez | 2026-02 | 11 | 15 | 0 | 15 |
| Giuli Grimaldi | 2026-02 | 3 | 20 | 8 | 12 |
| Giuli Grimaldi | 2026-02 | 5 | 20 | 2 | 18 |

3. **Columna F (Disponible):**
   - Fórmula: `=D2-E2` (Cupos - Reservas)
   - Se autocompleta sola

4. **Hacer pública la sheet** (solo lectura):
   - Botón "Compartir" → "Obtener enlace"
   - Cambiar a "Cualquier persona con el enlace puede ver"

---

## 💻 PARTE 2: CONECTAR AL CÓDIGO (Medio - Necesita programador)

### **Opción A: Con Gemini / Claude / ChatGPT**

**Prompt exacto para copiar y pegar:**

```
Necesito conectar mi sitio Next.js con una Google Sheet.

Mi objetivo:
- Leer datos de disponibilidad desde Google Sheets
- El sheet tiene columnas: Profesor, Mes, Día, Cupos, Reservas
- Quiero que mi componente TeacherBooking.tsx lea los datos
- Formato del sheet: cada fila es un día disponible

Configuración actual:
- Next.js 15
- TypeScript
- Ya tengo un type Teacher definido
- Actualmente los datos están en src/data/teachers.ts

URL del sheet público: [TU_URL_AQUI]

¿Puedes darme el código paso a paso usando la Google Sheets API v4?
Incluye:
1. Cómo obtener API key de Google
2. Código para leer el sheet
3. Cómo adaptar mi componente TeacherBooking.tsx
4. Variables de entorno necesarias
```

**El AI te va a dar:**
- ✅ Paso a paso para obtener API key
- ✅ Código listo para copiar/pegar
- ✅ Configuración de `.env.local`

---

### **Opción B: Llamarme a mí**

Si el AI no te ayuda bien, me escribís y yo lo implemento en 2-3 horas.

---

## 📦 PARTE 3: ALTERNATIVA MÁS SIMPLE (SIN API)

### **Usar CSV en vez de Google Sheets:**

1. **Exportar sheet a CSV:**
   - Archivo → Descargar → CSV

2. **Subir CSV al proyecto:**
   - Guardarlo en `public/data/disponibilidad.csv`

3. **Leer CSV desde el código:**
   ```typescript
   const response = await fetch('/data/disponibilidad.csv');
   const text = await response.text();
   // Parsear CSV...
   ```

**Pros:**
- ✅ Más simple (sin API keys)
- ✅ Gratis
- ✅ Rápido

**Contras:**
- ⏱️ Hay que exportar y subir CSV cada vez que cambia

---

## 🔧 CONFIGURACIÓN TÉCNICA (Para el programador)

### **Dependencias necesarias:**

```bash
npm install googleapis
```

### **Variables de entorno:**

```env
GOOGLE_SHEETS_API_KEY=tu_api_key_aqui
GOOGLE_SHEET_ID=id_del_sheet
```

### **Código base:**

```typescript
// src/lib/googleSheets.ts
import { google } from 'googleapis';

export async function getAvailability() {
  const sheets = google.sheets({
    version: 'v4',
    auth: process.env.GOOGLE_SHEETS_API_KEY
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A2:F', // Desde fila 2 hasta el final
  });

  const rows = response.data.values;
  
  // Transformar a formato Teacher
  const availability = {};
  rows?.forEach(([profesor, mes, dia, cupos, reservas]) => {
    if (!availability[profesor]) availability[profesor] = {};
    if (!availability[profesor][mes]) {
      availability[profesor][mes] = { days: [], cupos: 0, reservas: 0 };
    }
    availability[profesor][mes].days.push(parseInt(dia));
    availability[profesor][mes].cupos = parseInt(cupos);
    availability[profesor][mes].reservas = parseInt(reservas);
  });

  return availability;
}
```

---

## ⏱️ TIEMPOS ESTIMADOS:

| Tarea | Dificultad | Tiempo |
|-------|------------|--------|
| Crear Google Sheet | 🟢 Fácil | 10 min |
| Obtener API key | 🟡 Media | 20 min |
| Conectar código | 🟠 Media-Alta | 2 horas |
| Testing | 🟢 Fácil | 30 min |
| **TOTAL** | | **~3 horas** |

---

## 💰 COSTOS:

- Google Sheets API: **GRATIS** (hasta 100 requests/min)
- Sheets mismas: **GRATIS**
- Hosting: **SIN CAMBIOS** (Vercel sigue gratis)

---

## 📊 CUÁNDO IMPLEMENTAR:

### ✅ **Vale la pena si:**
- 50+ reservas por mes
- Múltiples personas actualizan cupos
- Quieren reportes/estadísticas
- El manual se vuelve tedioso

### ❌ **NO vale la pena si:**
- Menos de 30 reservas/mes
- 1 sola persona gestiona
- La actualización manual es rápida

---

## 🎯 RESUMEN PARA GEMINI/CLAUDE:

**Cuando quieran implementarlo, copiar y pegar este prompt:**

```
Hola, necesito ayuda para conectar Google Sheets a mi sitio Next.js.

Contexto:
- Tengo un estudio de danza con 21 profesores
- Cada profesor tiene días disponibles por mes
- Necesito que los cupos se actualicen desde Google Sheets

Tecnología:
- Next.js 15 con TypeScript
- Vercel hosting
- Ya funciona con datos estáticos en teachers.ts

Sheet estructura:
Columnas: Profesor | Mes | Día | Cupos | Reservas

Necesito:
1. Paso a paso para obtener Google API key
2. Código para leer el sheet
3. Cómo adaptar mi componente existente
4. Variables de entorno

¿Me das el código completo con explicaciones?
```

---

## 📞 CONTACTO:

Si el AI no te ayuda bien o tenés dudas, contactame y lo implemento yo en 2-3 horas.

---

**Archivo creado para referencia futura. NO implementar ahora.** ✅
