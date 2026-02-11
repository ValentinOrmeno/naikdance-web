-- ================================================
-- RESETEAR CUPOS - Eliminar toda la disponibilidad
-- ================================================
-- Ejecutar en Supabase SQL Editor para empezar de cero

-- Opción 1: Borrar TODA la disponibilidad (días, cupos, todo)
DELETE FROM availability;

-- Opción 2: Solo borrar cupos de Supabase pero mantener estructura
-- (descomenta esta y comenta la de arriba si prefieres esto)
-- UPDATE availability SET cupos_reservados = 0;

-- Verificar que quedó vacío:
SELECT COUNT(*) as total_availability FROM availability;

-- También podemos limpiar horarios (class_schedules) si existen
DELETE FROM class_schedules;

-- Y limpiar reservas si querés empezar de cero completo
-- (CUIDADO: esto borra todas las reservas históricas)
-- DELETE FROM reservations;
