-- Script para agregar disponibilidad de TODOS los profesores
-- Ejecutar en Supabase SQL Editor

-- Limpiar datos existentes (opcional, comentar si no queres borrar)
-- DELETE FROM availability;

-- Agregar disponibilidad para TODOS los profes (Febrero y Marzo 2026)
INSERT INTO availability (teacher_id, month, days, cupos_total, cupos_reservados) VALUES
  -- Fran Benitez (ya existe, pero por si acaso)
  ('fran-benitez', '2026-02', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 15, 3),
  ('fran-benitez', '2026-03', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 15, 0),
  
  -- Giuli Grimaldi (ya existe, pero por si acaso)
  ('giuli-grimaldi', '2026-02', ARRAY[3, 5, 10, 12, 17, 19, 24, 26], 20, 8),
  ('giuli-grimaldi', '2026-03', ARRAY[3, 5, 10, 12, 17, 19, 24, 26, 31], 20, 0),
  
  -- Rodri Chazareta (Hip Hop / Freestyle)
  ('rodri-chazareta', '2026-02', ARRAY[6, 7, 13, 14, 20, 21, 27, 28], 18, 0),
  ('rodri-chazareta', '2026-03', ARRAY[6, 7, 13, 14, 20, 21, 27, 28], 18, 0),
  
  -- Jenn Mendoza (Street Jazz / K-Pop)
  ('jenn-mendoza', '2026-02', ARRAY[3, 5, 10, 12, 17, 19, 24, 26], 16, 0),
  ('jenn-mendoza', '2026-03', ARRAY[3, 5, 10, 12, 17, 19, 24, 26, 31], 16, 0),
  
  -- Juan Pico (Urbano Avanzado)
  ('juan-pico', '2026-02', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 12, 0),
  ('juan-pico', '2026-03', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 12, 0),
  
  -- Mili Mereles (Waacking / Voguing)
  ('mili-mereles', '2026-02', ARRAY[3, 7, 10, 14, 17, 21, 24, 28], 15, 0),
  ('mili-mereles', '2026-03', ARRAY[3, 7, 10, 14, 17, 21, 24, 28], 15, 0),
  
  -- Matias Diaz (Tecnica / Urbano)
  ('matias-diaz', '2026-02', ARRAY[4, 5, 11, 12, 18, 19, 25, 26], 14, 0),
  ('matias-diaz', '2026-03', ARRAY[4, 5, 11, 12, 18, 19, 25, 26], 14, 0),
  
  -- Airton Barria (Reggaeton)
  ('airton-barria', '2026-02', ARRAY[3, 10, 17, 24], 20, 0),
  ('airton-barria', '2026-03', ARRAY[3, 10, 17, 24, 31], 20, 0),
  
  -- Alan Guttierrez (Hip Hop)
  ('alan-guttierrez', '2026-02', ARRAY[3, 10, 17, 24], 18, 0),
  ('alan-guttierrez', '2026-03', ARRAY[3, 10, 17, 24, 31], 18, 0),
  
  -- Camilo Gonzalez (Urbano)
  ('camilo-gonzalez', '2026-02', ARRAY[6, 13, 20, 27], 16, 0),
  ('camilo-gonzalez', '2026-03', ARRAY[6, 13, 20, 27], 16, 0),
  
  -- Catha Galeano (Reggaeton)
  ('catha-galeano', '2026-02', ARRAY[3, 10, 17, 24], 18, 0),
  ('catha-galeano', '2026-03', ARRAY[3, 10, 17, 24, 31], 18, 0),
  
  -- Daichu Alderete (K-Pop)
  ('daichu-alderete', '2026-02', ARRAY[7, 14, 21, 28], 20, 0),
  ('daichu-alderete', '2026-03', ARRAY[7, 14, 21, 28], 20, 0),
  
  -- Flor Gonzalez (Twerk)
  ('flor-gonzalez', '2026-02', ARRAY[3, 10, 17, 24], 15, 0),
  ('flor-gonzalez', '2026-03', ARRAY[3, 10, 17, 24, 31], 15, 0),
  
  -- Flor Lizarraga (Hip Hop)
  ('flor-lizarraga', '2026-02', ARRAY[4, 11, 18, 25], 16, 0),
  ('flor-lizarraga', '2026-03', ARRAY[4, 11, 18, 25], 16, 0),
  
  -- Flor Parra (Reggaeton)
  ('flor-parra', '2026-02', ARRAY[6, 13, 20, 27], 18, 0),
  ('flor-parra', '2026-03', ARRAY[6, 13, 20, 27], 18, 0),
  
  -- Rocio Canchi (K-Pop / Femme)
  ('rocio-canchi', '2026-02', ARRAY[4, 5, 11, 12, 18, 19, 25, 26], 20, 0),
  ('rocio-canchi', '2026-03', ARRAY[4, 5, 11, 12, 18, 19, 25, 26], 20, 0),
  
  -- Sele Chaile (Urbano)
  ('sele-chaile', '2026-02', ARRAY[4, 11, 18, 25], 16, 0),
  ('sele-chaile', '2026-03', ARRAY[4, 11, 18, 25], 16, 0),
  
  -- Vicky Martini (Contemporaneo)
  ('vicky-martini', '2026-02', ARRAY[2, 9, 16, 23], 14, 0),
  ('vicky-martini', '2026-03', ARRAY[2, 9, 16, 23, 30], 14, 0),
  
  -- Zuly Silveira (Reggaeton)
  ('zuly-silveira', '2026-02', ARRAY[3, 10, 17, 24], 18, 0),
  ('zuly-silveira', '2026-03', ARRAY[3, 10, 17, 24, 31], 18, 0),
  
  -- Mili Gonzalez (Reggaeton Fusion)
  ('mili-gonzalez', '2026-02', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 16, 0),
  ('mili-gonzalez', '2026-03', ARRAY[4, 6, 11, 13, 18, 20, 25, 27], 16, 0),
  
  -- Lyrical Jazz Staff
  ('lyrical-jazz', '2026-02', ARRAY[3, 4, 10, 11, 17, 18, 24, 25], 18, 0),
  ('lyrical-jazz', '2026-03', ARRAY[3, 4, 10, 11, 17, 18, 24, 25], 18, 0),
  
  -- Acro Kids Staff
  ('acro-kids', '2026-02', ARRAY[7, 14, 21, 28], 15, 0),
  ('acro-kids', '2026-03', ARRAY[7, 14, 21, 28], 15, 0),
  
  -- Seba Gardel (Reggaeton)
  ('seba-gardel', '2026-02', ARRAY[5, 12, 19, 26], 18, 0),
  ('seba-gardel', '2026-03', ARRAY[5, 12, 19, 26], 18, 0)
ON CONFLICT (teacher_id, month) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT teacher_id, month, cupos_total, cupos_reservados 
FROM availability 
ORDER BY teacher_id, month;
