-- ================================================
-- FIX: Agregar políticas de escritura para availability
-- ================================================
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar política antigua si existe (solo tenía SELECT)
DROP POLICY IF EXISTS "Availability es pública para lectura" ON availability;

-- 2. Crear nuevas políticas completas para availability
CREATE POLICY "Availability lectura pública" ON availability
  FOR SELECT USING (true);

CREATE POLICY "Availability escritura pública" ON availability
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Availability actualización pública" ON availability
  FOR UPDATE USING (true);

CREATE POLICY "Availability eliminación pública" ON availability
  FOR DELETE USING (true);

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'availability';
