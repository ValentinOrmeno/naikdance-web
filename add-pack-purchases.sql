-- Tabla para registrar compras de packs, cuponeras y pases
CREATE TABLE IF NOT EXISTS pack_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_email TEXT NOT NULL,
  alumno_nombre TEXT NOT NULL,
  alumno_telefono TEXT,
  pack_type TEXT NOT NULL, -- Ej: "Pack Mensual", "Cuponeras", "Pase Libre / Full"
  pack_name TEXT NOT NULL, -- Ej: "PACK X4", "8 Clases"
  clases_incluidas INTEGER, -- Cantidad de clases incluidas (NULL = ilimitado)
  clases_usadas INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'completo', 'vencido')),
  origin TEXT NOT NULL CHECK (origin IN ('mercado_pago', 'efectivo', 'manual')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pack_purchases_email ON pack_purchases(alumno_email);
CREATE INDEX IF NOT EXISTS idx_pack_purchases_status ON pack_purchases(status);

-- Trigger para updated_at (usa la función global definida en supabase-schema.sql)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_pack_purchases_updated_at'
  ) THEN
    CREATE TRIGGER update_pack_purchases_updated_at
    BEFORE UPDATE ON pack_purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- RLS
ALTER TABLE pack_purchases ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pack_purchases' AND policyname = 'Pack purchases lectura pública'
  ) THEN
    CREATE POLICY "Pack purchases lectura pública" ON pack_purchases
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pack_purchases' AND policyname = 'Pack purchases escritura pública'
  ) THEN
    CREATE POLICY "Pack purchases escritura pública" ON pack_purchases
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pack_purchases' AND policyname = 'Pack purchases actualización pública'
  ) THEN
    CREATE POLICY "Pack purchases actualización pública" ON pack_purchases
      FOR UPDATE USING (true);
  END IF;
END $$;

