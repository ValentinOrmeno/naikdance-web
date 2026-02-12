-- Crear tabla para horarios de clases específicas por profesor
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT NOT NULL,
  month TEXT NOT NULL, -- Formato: "2026-02"
  day INTEGER NOT NULL, -- Día del mes (1-31)
  time TEXT NOT NULL, -- Formato: "18:00"
  class_name TEXT NOT NULL, -- Nombre de la clase (ej: "Hip Hop Intermedio")
  duration INTEGER DEFAULT 60, -- Duración en minutos
  max_students INTEGER DEFAULT 15, -- Máximo de alumnos por clase
  price INTEGER DEFAULT 7500, -- Precio de clase suelta en pesos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columna price si no existe (para tablas ya creadas)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'class_schedules' AND column_name = 'price'
  ) THEN
    ALTER TABLE class_schedules ADD COLUMN price INTEGER DEFAULT 7500;
  END IF;
END $$;

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_class_schedules_teacher_month ON class_schedules(teacher_id, month);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day ON class_schedules(day);

-- Constraint único para evitar duplicados (teacher + month + day + time)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'class_schedules_unique_slot'
  ) THEN
    ALTER TABLE class_schedules 
    ADD CONSTRAINT class_schedules_unique_slot 
    UNIQUE (teacher_id, month, day, time);
  END IF;
END $$;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_class_schedules_updated_at ON class_schedules;
CREATE TRIGGER update_class_schedules_updated_at 
BEFORE UPDATE ON class_schedules
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (lectura pública, escritura pública por ahora)
DROP POLICY IF EXISTS "Class schedules lectura publica" ON class_schedules;
CREATE POLICY "Class schedules lectura publica" ON class_schedules
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Class schedules escritura publica" ON class_schedules;
CREATE POLICY "Class schedules escritura publica" ON class_schedules
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Class schedules escritura publica UPDATE" ON class_schedules;
CREATE POLICY "Class schedules escritura publica UPDATE" ON class_schedules
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Class schedules escritura publica DELETE" ON class_schedules;
CREATE POLICY "Class schedules escritura publica DELETE" ON class_schedules
  FOR DELETE USING (true);

-- Ejemplo de datos iniciales (Fran Benitez - Febrero 2026)
-- Usar ON CONFLICT para evitar duplicados
INSERT INTO class_schedules (teacher_id, month, day, time, class_name, max_students, price) VALUES
  ('fran-benitez', '2026-02', 4, '18:00', 'Hip Hop Intermedio', 15, 7500),
  ('fran-benitez', '2026-02', 4, '19:30', 'Hip Hop Avanzado', 12, 7500),
  ('fran-benitez', '2026-02', 6, '18:00', 'Freestyle', 15, 7500),
  ('fran-benitez', '2026-02', 11, '18:00', 'Hip Hop Intermedio', 15, 7500),
  ('fran-benitez', '2026-02', 13, '19:30', 'Hip Hop Avanzado', 12, 7500)
ON CONFLICT DO NOTHING;

-- Ejemplo: Giuli Grimaldi
INSERT INTO class_schedules (teacher_id, month, day, time, class_name, max_students, price) VALUES
  ('giuli-grimaldi', '2026-02', 3, '17:00', 'Reggaeton Principiante', 20, 7500),
  ('giuli-grimaldi', '2026-02', 3, '18:30', 'Reggaeton Intermedio', 18, 7500),
  ('giuli-grimaldi', '2026-02', 5, '17:00', 'Urbano Femenino', 20, 7500),
  ('giuli-grimaldi', '2026-02', 10, '18:30', 'Reggaeton Avanzado', 15, 7500)
ON CONFLICT DO NOTHING;

-- Verificar los datos
SELECT teacher_id, month, day, time, class_name, max_students 
FROM class_schedules 
ORDER BY teacher_id, month, day, time;
