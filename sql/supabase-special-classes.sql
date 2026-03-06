-- Tabla para clases especiales (flyers tipo historia de Instagram)
-- Ejecutar en el SQL Editor de Supabase.

create table if not exists public.special_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_label text not null,
  audience text not null default '',
  price_label text not null default '',
  promo_note text,
  image_url text,
  whatsapp_message text not null default '',
  valid_until timestamptz,
  sort_order int not null default 0,
  price_amount int,
  created_at timestamptz not null default now()
);

-- Si la tabla ya existía con image_url not null, permitir null (subir sin imagen):
-- alter table public.special_classes alter column image_url drop not null;
--
-- Si la tabla ya existía, agregar columna para pago con Mercado Pago:
-- alter table public.special_classes add column if not exists price_amount int;

alter table public.special_classes enable row level security;

create policy "Permitir lectura pública de special_classes"
  on public.special_classes for select
  using (true);

-- Sin políticas de INSERT/UPDATE/DELETE: solo el service role (API con contraseña admin) puede escribir.
-- Crear bucket en Dashboard > Storage: nombre "special-classes", público, con política de lectura pública.
-- En .env.local y Vercel: SUPABASE_SERVICE_ROLE_KEY (desde Supabase > Settings > API).
