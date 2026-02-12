-- Agregar columnas source y expires_at a reservations (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'source'
  ) THEN
    ALTER TABLE reservations
      ADD COLUMN source TEXT NOT NULL DEFAULT 'web';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE reservations
      ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- Asegurar restricción de valores permitidos en source
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reservations_source_check'
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_source_check
      CHECK (source IN ('web', 'whatsapp', 'mercado_pago'));
  END IF;
END $$;

