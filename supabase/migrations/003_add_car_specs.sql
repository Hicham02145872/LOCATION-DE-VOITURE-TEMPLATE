-- Migration: Add performance specs to cars
alter table public.cars
  add column if not exists acceleration text not null default '5.2s',
  add column if not exists range_km integer not null default 600,
  add column if not exists top_speed text not null default '220km/h';
