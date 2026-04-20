-- Run this in your Supabase SQL editor

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'note' check (type in ('note', 'todo')),
  content text not null,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (optional for personal use, but good practice)
alter table notes enable row level security;

-- Allow all operations for now (single-user personal app)
create policy "Allow all" on notes for all using (true) with check (true);
