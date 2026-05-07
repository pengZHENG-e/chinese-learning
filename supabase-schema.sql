-- Run this in Supabase Dashboard → SQL Editor.
create table if not exists progress (
  email      text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Server-side only access (we use the service-role key from API routes),
-- so RLS can stay disabled. Anonymous clients never touch this table.
alter table progress disable row level security;
