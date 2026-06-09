-- Migration: Add ville (city) location to cars
alter table public.cars
  add column if not exists ville text not null default 'Marrakech';
