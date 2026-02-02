# 📋 Dos Versiones de Aranceles para Presentar al Cliente

## 🎨 Versión 1: Botones Grandes Verticales (ACTUAL)
**Archivo:** `src/components/Pricing.tsx`

### Características:
- ✅ Botones apilados verticalmente
- ✅ Mayor tamaño y visibilidad
- ✅ Diseño más espacioso
- ✅ Similar al estilo de la imagen de referencia
- ✅ Mejor para destacar ambas opciones de pago

### Vista previa:
```
┌─────────────────────┐
│   PACK X2           │
│   $12.000           │
│   ┌───────────────┐ │
│   │  $  EFECTIVO  │ │
│   └───────────────┘ │
│   ┌───────────────┐ │
│   │ ◉ mercado pago│ │
│   └───────────────┘ │
└─────────────────────┘
```

---

## 🎨 Versión 2: Botones Compactos Horizontales
**Archivo:** `src/components/PricingCompact.tsx`

### Características:
- ✅ Botones lado a lado
- ✅ Diseño más compacto
- ✅ Ahorra espacio vertical
- ✅ Ideal para muchos productos
- ✅ Vista más moderna y minimalista

### Vista previa:
```
┌─────────────────────┐
│   PACK X2           │
│   $12.000           │
│   ┌─────┐ ┌───────┐│
│   │💵   │ │◉ M.P. ││
│   └─────┘ └───────┘│
└─────────────────────┘
```

---

## 🔄 Cómo Cambiar Entre Versiones

### Para usar la Versión 1 (Botones Verticales - ACTUAL):
En `src/app/page.tsx`:
```typescript
import Pricing from '@/components/Pricing';
```

### Para usar la Versión 2 (Botones Horizontales):
En `src/app/page.tsx`:
```typescript
import Pricing from '@/components/PricingCompact';
```

---

## 💡 Recomendación

**Versión 1 (Vertical):**
- Mejor para conversión
- Más fácil de usar en móvil
- Botones más visibles

**Versión 2 (Horizontal):**
- Más profesional
- Mejor para desktop
- Más espacio para otros contenidos

---

## 📸 Presentación al Cliente

Podés mostrar ambas versiones al cliente de estas formas:

1. **Screenshots:** Sacar capturas de ambas versiones
2. **Deploy temporal:** Subir ambas a URLs diferentes
3. **Presentación en vivo:** Cambiar entre versiones en tiempo real

---

**Fecha:** 2026-02-02
**Desarrollador:** Valentín Ormeño
