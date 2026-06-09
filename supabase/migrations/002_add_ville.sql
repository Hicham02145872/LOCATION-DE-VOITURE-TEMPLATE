-- Migration: Add ville field to reservations
alter table public.reservations
  add column if not exists ville text not null default 'Marrakech';
