# 📸 Guía para Tomar Screenshots Profesionales

## 🎯 Objetivo
Mostrarle al cliente ambas versiones de Aranceles para que elija su preferida.

---

## 📋 Preparación

### 1️⃣ **Versión 1: Botones Verticales (ACTUAL)**

Ya está activa en el sitio. Solo necesitás:

```bash
npm run dev
```

Abrí: `http://localhost:3000/#aranceles`

---

### 2️⃣ **Versión 2: Botones Horizontales**

Para activarla temporalmente:

1. Abrí `src/app/page.tsx`
2. Cambiá la línea:
   ```typescript
   import Pricing from '@/components/Pricing';
   ```
   Por:
   ```typescript
   import Pricing from '@/components/PricingCompact';
   ```
3. Guardá el archivo (hot reload automático)
4. Refrescá el navegador

---

## 📸 Cómo Tomar Screenshots

### **Opción A: Con el Navegador (Recomendado)**

**Chrome/Edge:**
1. Presioná `F12` (Abrir DevTools)
2. Presioná `Ctrl + Shift + P` (Command Palette)
3. Escribí "Capture full size screenshot"
4. Enter ✅

**Firefox:**
1. Click derecho en la página
2. "Tomar captura de pantalla"
3. "Guardar página completa"

---

### **Opción B: Herramientas Online**

**1. Screely.com** (añade mockup bonito)
- Pegá tu screenshot
- Elige fondo y sombras
- Descargá

**2. CleanShot X / Snagit** (apps desktop)
- Captura con scrolling
- Anotaciones profesionales

---

## 📐 Recomendaciones de Captura

### **Para Presentación al Cliente:**

✅ **Capturas que debés tomar:**

1. **Vista completa de Aranceles - Versión 1**
   - Incluí el título "ARANCELES 2026"
   - Mostrá todas las 4 columnas (si es desktop)
   - Resolución: Escritorio (1920x1080)

2. **Vista completa de Aranceles - Versión 2**
   - Misma configuración que arriba
   - Asegurate de tener las mismas condiciones (zoom, etc)

3. **Vista móvil de una tarjeta - Versión 1**
   - F12 → Toggle device toolbar (Ctrl+Shift+M)
   - iPhone 12 Pro (390x844)
   - Mostrá UNA tarjeta completa

4. **Vista móvil de una tarjeta - Versión 2**
   - Misma configuración móvil

5. **Comparación lado a lado** (opcional)
   - Usá un editor de imágenes
   - Poné ambas versiones juntas

---

## 🎨 Configuración del Navegador

### Antes de capturar:

1. **Zoom al 100%** (Ctrl+0)
2. **Modo oscuro activado** (el sitio ya es oscuro)
3. **Ocultá la barra de marcadores** (Ctrl+Shift+B)
4. **Ventana maximizada**
5. **Sin extensiones visibles en la UI**

---

## 📱 Resoluciones Recomendadas

### **Desktop:**
- **1920x1080** - Estándar HD
- **1440x900** - Laptop común
- **2560x1440** - 2K

### **Móvil:**
- **390x844** - iPhone 12/13/14 Pro
- **414x896** - iPhone 11 Pro Max
- **360x800** - Android estándar

---

## 💡 Tips para Screenshots Profesionales

### ✅ **Hacer:**
- Capturá en horario con buena luz (si mostrás pantalla)
- Usá modo incógnito para UI limpia
- Asegurate que todo el texto sea legible
- Capturá hover states (pasando el mouse sobre botones)

### ❌ **Evitar:**
- Notificaciones del sistema visibles
- Pestañas del navegador abiertas
- Datos personales en la pantalla
- Capturas borrosas o pixeladas

---

## 📧 Cómo Presentar al Cliente

### **Formato recomendado:**

```
📧 Asunto: Naik Dance - 2 Opciones de Diseño para Aranceles

Hola [Cliente],

Te comparto dos opciones de diseño para la sección de aranceles:

🎨 VERSIÓN 1: Botones Grandes (Recomendada)
[Adjuntar screenshots]
✅ Más visible en móvil
✅ Mejor conversión
✅ Más fácil de usar

🎨 VERSIÓN 2: Botones Compactos
[Adjuntar screenshots]
✅ Diseño más minimalista
✅ Ahorra espacio
✅ Vista más profesional

¿Cuál te gusta más? Puedo implementar la que prefieras
o hacer ajustes si querés algo diferente.

Saludos!
```

---

## 🔧 Troubleshooting

**❓ "El sitio no carga"**
→ Asegurate que `npm run dev` esté corriendo

**❓ "Los cambios no se ven"**
→ Guardá el archivo y refrescá el navegador (Ctrl+R)

**❓ "Las capturas salen mal"**
→ Revisá el zoom (debe estar al 100%)

**❓ "No sé cuál recomendar"**
→ Versión 1 (vertical) suele convertir mejor

---

## 📊 Comparación Rápida

| Característica | Versión 1 (Vertical) | Versión 2 (Horizontal) |
|----------------|---------------------|------------------------|
| Visibilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Espacio | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Mobile | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Desktop | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Conversión | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

**✨ Consejo final:** Si el cliente no sabe cuál elegir, recomendá la **Versión 1 (Vertical)** porque está probada para mejor conversión en móviles.

---

**Fecha:** 2026-02-02
**Desarrollador:** Valentín Ormeño
