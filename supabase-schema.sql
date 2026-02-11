-- ================================================
-- SCHEMA PARA NAIK DANCE - SISTEMA DE RESERVAS
-- ================================================

-- 1. Tabla de Disponibilidad por Profesor y Mes
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT NOT NULL,
  month TEXT NOT NULL, -- Formato: "2026-02"
  days INTEGER[] NOT NULL, -- Array de días disponibles [1, 5, 8, 12...]
  cupos_total INTEGER NOT NULL,
  cupos_reservados INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, month)
);

-- 2. Tabla de Reservas
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  clase TEXT NOT NULL,
  fecha TEXT NOT NULL, -- Formato: "15/02/2026"
  month TEXT NOT NULL, -- Formato: "2026-02"
  status TEXT NOT NULL CHECK (status IN ('pendiente', 'confirmada', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para mejorar performance
CREATE INDEX idx_availability_teacher_month ON availability(teacher_id, month);
CREATE INDEX idx_reservations_teacher_month ON reservations(teacher_id, month);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created_at ON reservations(created_at DESC);

-- 4. Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Triggers para actualizar updated_at
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Insertar datos iniciales de disponibilidad (de teachers.ts)
INSERT INTO availability (teacher_id, month, days, cupos_total, cupos_reservados) VALUES
  ('fran-benitez', '2026-02', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 15, 3),
  ('fran-benitez', '2026-03', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 15, 0),
  ('giuli-grimaldi', '2026-02', ARRAY[3, 5, 10, 12, 17, 19, 24, 26], 20, 8),
  ('giuli-grimaldi', '2026-03', ARRAY[3, 5, 10, 12, 17, 19, 24, 26, 31], 20, 0);

-- 7. Habilitar Row Level Security (RLS)
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 8. Políticas de seguridad para availability (lectura y escritura pública)
CREATE POLICY "Availability lectura pública" ON availability
  FOR SELECT USING (true);

CREATE POLICY "Availability escritura pública" ON availability
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Availability actualización pública" ON availability
  FOR UPDATE USING (true);

CREATE POLICY "Availability eliminación pública" ON availability
  FOR DELETE USING (true);

-- 9. Políticas de seguridad para reservations (lectura y escritura pública)
CREATE POLICY "Reservations lectura pública" ON reservations
  FOR SELECT USING (true);

CREATE POLICY "Reservations escritura pública" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Reservations actualización pública" ON reservations
  FOR UPDATE USING (true);

-- Nota: En producción, deberías restringir más las políticas
-- Por ahora, para simplificar, permitimos lectura/escritura pública
