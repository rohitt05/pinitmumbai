-- Enable PostGIS
create extension if not exists postgis;

-- Main reports table
create table reports (
  id uuid primary key default gen_random_uuid(),
  lat double precision not null,
  lng double precision not null,
  location geography(Point, 4326) generated always as
    (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) stored,
  category text not null check (
    category in ('roads','garbage','streetlight','water','safety','theft','other')
  ),
  description text,
  area_name text,
  photo_url text not null,
  upvotes integer default 0,
  created_at timestamptz default now()
);

-- Indexes for geo queries
create index reports_location_idx on reports using gist(location);
create index reports_category_idx on reports(category);
create index reports_created_at_idx on reports(created_at desc);

-- Enable Realtime on reports table
alter publication supabase_realtime add table reports;

-- RLS: anyone can read, anyone can insert, nobody can update/delete
alter table reports enable row level security;
create policy "Public read" on reports for select using (true);
create policy "Public insert" on reports for insert with check (true);

-- Upvote function (avoids race conditions)
create or replace function increment_upvote(report_id uuid)
returns void as $$
  update reports set upvotes = upvotes + 1 where id = report_id;
$$ language sql;

-- NOTE: Create Storage bucket manually in Supabase Dashboard
-- Bucket name: report-photos
-- Public: true
