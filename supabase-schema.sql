-- Run this in Supabase Dashboard → SQL Editor.

create table if not exists progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table progress enable row level security;

drop policy if exists "users manage own progress" on progress;
create policy "users manage own progress"
  on progress for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
