# 📅 Cómo Editar Disponibilidad y Cupos de Profes

## 🎯 TODO se edita en UN solo archivo:

```
src/data/teachers.ts
```

---

## ✏️ EJEMPLO COMPLETO:

```typescript
{
  id: "fran-benitez",
  name: "Fran Benitez",
  style: "Urbano / Coreografia",
  image: "/profes/fran-benitez.png",
  classes: ["Martes 19:00 - Urbano Mix", "Jueves 20:00 - Coreo"],
  
  // ⬇️ ESTA es la parte que editás ⬇️
  availability: {
    "2026-02": {           // ← Febrero 2026
      days: [4, 6, 11, 13, 18, 20, 25, 27],  // ← Días disponibles
      cupos: 15,           // ← Cupos totales
      reservas: 3          // ← Ya reservaron 3, quedan 12
    },
    "2026-03": {           // ← Marzo 2026
      days: [4, 6, 11, 13, 18, 20, 25, 27],
      cupos: 15,
      reservas: 0          // ← Empieza en 0 cada mes
    },
  },
},
```

---

## 📝 PASOS PARA EDITAR:

### **1️⃣ Agregar un nuevo mes:**

```typescript
availability: {
  "2026-02": { days: [4, 6, 11], cupos: 15, reservas: 0 },
  "2026-03": { days: [4, 6, 11], cupos: 15, reservas: 0 },
  "2026-04": { days: [1, 8, 15], cupos: 15, reservas: 0 },  // ← NUEVO
},
```

### **2️⃣ Cambiar días disponibles:**

```typescript
// Antes:
days: [4, 6, 11, 13]

// Después (agregamos más días):
days: [4, 6, 11, 13, 18, 20, 25, 27]
```

### **3️⃣ Cambiar cupos:**

```typescript
// 20 cupos en vez de 15:
cupos: 20,
reservas: 0
```

### **4️⃣ Actualizar reservas** (cuando alguien reserva):

```typescript
// Antes:
reservas: 0   // Nadie reservó

// Después (reservaron 3 personas):
reservas: 3   // Quedan 12 cupos disponibles (15 - 3)
```

---

## 🗓️ FORMATO DE FECHAS:

```typescript
"YYYY-MM": { ... }
```

**Ejemplos:**
- `"2026-01"` → Enero 2026
- `"2026-02"` → Febrero 2026
- `"2026-12"` → Diciembre 2026
- `"2027-01"` → Enero 2027

---

## 📋 DÍAS DE LA SEMANA:

**Cómo saber qué días poner:**

```
Lunes = [3, 10, 17, 24, 31]       (Ejemplo febrero 2026)
Martes = [4, 11, 18, 25]
Miércoles = [5, 12, 19, 26]
Jueves = [6, 13, 20, 27]
Viernes = [7, 14, 21, 28]
Sábado = [1, 8, 15, 22]
Domingo = [2, 9, 16, 23]
```

💡 **TIP:** Usá un calendario para ver qué días de la semana caen en cada fecha.

---

## ✅ CASOS COMUNES:

### **Profesor sin disponibilidad todavía:**

```typescript
{
  id: "nuevo-profe",
  name: "Nuevo Profe",
  style: "Hip Hop",
  image: "/profes/nuevo-profe.png",
  classes: ["Lunes 18:00 - Hip Hop"],
  // ← NO poner availability = calendario no se muestra
},
```

### **Profesor con clases todos los martes:**

```typescript
availability: {
  "2026-02": {
    days: [4, 11, 18, 25],  // Todos los martes de febrero
    cupos: 20,
    reservas: 0
  },
},
```

### **Clases LLENAS (sin cupos):**

```typescript
availability: {
  "2026-02": {
    days: [4, 11, 18, 25],
    cupos: 15,
    reservas: 15  // ← 15/15 = SIN CUPOS (aparece punto rojo)
  },
},
```

---

## 🚀 DESPUÉS DE EDITAR:

### **Opción A: Subir cambios manualmente**

```bash
1. Guardá el archivo teachers.ts
2. Abrí la terminal en el proyecto
3. Ejecutá:
   git add src/data/teachers.ts
   git commit -m "Actualizar disponibilidad profes"
   git push origin main
4. Vercel lo deployea automáticamente (1-2 minutos)
```

### **Opción B: Pedirme que lo suba**

```
"Che, actualicé la disponibilidad de Fran y Giuli, podés subirlo?"
```

---

## 💡 TIPS:

1. **Reservas** → Empiezan en 0 cada mes nuevo
2. **Cupos** → Puede ser diferente por profe (algunos 15, otros 20)
3. **Días** → Pueden ser irregulares (no tiene que ser siempre igual)
4. **Sin availability** → El calendario no se muestra (útil para profes nuevos)

---

## 🔴 SI HAY ERROR:

Si el sitio no carga después de editar:

1. **Revisá la sintaxis:**
   - ¿Pusiste comas donde van?
   - ¿Cerraste todos los corchetes `[]` y llaves `{}`?

2. **Formato de mes correcto:**
   - ✅ `"2026-02"` (con comillas, guión, mes con 2 dígitos)
   - ❌ `2026-2` (sin comillas, mes sin 0)

3. **Arrays de días:**
   - ✅ `days: [1, 5, 8, 12]`
   - ❌ `days: 1, 5, 8, 12` (falta `[]`)

---

## 📊 EJEMPLO REAL COMPLETO:

```typescript
export const teachers: Teacher[] = [
  {
    id: "fran-benitez",
    name: "Fran Benitez",
    style: "Urbano / Coreografia",
    image: "/profes/fran-benitez.png",
    classes: ["Martes 19:00 - Urbano Mix", "Jueves 20:00 - Coreo"],
    availability: {
      "2026-02": { days: [4, 6, 11, 13, 18, 20, 25, 27], cupos: 15, reservas: 3 },
      "2026-03": { days: [4, 6, 11, 13, 18, 20, 25, 27], cupos: 15, reservas: 0 },
      "2026-04": { days: [1, 3, 8, 10, 15, 17, 22, 24, 29], cupos: 15, reservas: 0 },
    },
  },
  {
    id: "giuli-grimaldi",
    name: "Giuli Grimaldi",
    style: "Reggaeton / Femme",
    image: "/profes/giuli-grimaldi.png",
    classes: ["Lunes 18:00 - Reggaeton Inicial", "Miercoles 19:00 - Femme"],
    availability: {
      "2026-02": { days: [3, 5, 10, 12, 17, 19, 24, 26], cupos: 20, reservas: 8 },
      "2026-03": { days: [3, 5, 10, 12, 17, 19, 24, 26, 31], cupos: 20, reservas: 0 },
    },
  },
  {
    id: "nuevo-sin-disponibilidad",
    name: "Nuevo Profe",
    style: "Hip Hop",
    image: "/profes/nuevo.png",
    classes: ["Viernes 20:00 - Hip Hop"],
    // Sin availability = no se muestra calendario todavía
  },
];
```

---

## ❓ DUDAS FRECUENTES:

**P: ¿Tengo que actualizar las reservas manualmente?**  
R: Sí, por ahora. Cuando alguien reserve por WhatsApp, sumás +1 a `reservas`.

**P: ¿Puedo poner diferentes cupos por mes?**  
R: Sí:
```typescript
"2026-02": { days: [...], cupos: 15, reservas: 0 },
"2026-03": { days: [...], cupos: 20, reservas: 0 },  // ← 20 en marzo
```

**P: ¿Qué pasa si no pongo availability?**  
R: El calendario no aparece. Útil para profes que no están dando clases todavía.

**P: ¿Puedo ver cuántos cupos quedan en el sitio?**  
R: Sí! Se muestra en el calendario: "Cupos disponibles: 12/15"

---

**¿Dudas? Preguntame y te ayudo a editarlo!** 😊
