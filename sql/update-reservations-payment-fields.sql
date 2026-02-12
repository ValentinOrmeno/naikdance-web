-- Agregar campos de pago a la tabla de reservas
-- Ejecutar en Supabase SQL Editor

-- Agregar columna payment_id si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE reservations ADD COLUMN payment_id TEXT;
  END IF;
END $$;

-- Agregar columna payment_status si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE reservations ADD COLUMN payment_status TEXT;
  END IF;
END $$;

-- Agregar índice para búsqueda por payment_id
CREATE INDEX IF NOT EXISTS idx_reservations_payment_id ON reservations(payment_id);

-- Verificar las columnas agregadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservations' 
ORDER BY ordinal_position;
