-- Run once in the Supabase SQL editor.
create table if not exists city_data (
  slug text primary key,
  city_name text not null,
  weather jsonb not null,
  air_quality jsonb not null,
  forecast jsonb not null,
  updated_at timestamptz default now()
);

create index if not exists idx_city_data_updated on city_data(updated_at);

-- The anon key is public, so lock the table down: anyone may read,
-- only the service role (which bypasses RLS) may write.
alter table city_data enable row level security;

drop policy if exists "Public read access" on city_data;
create policy "Public read access" on city_data
  for select to anon, authenticated using (true);
