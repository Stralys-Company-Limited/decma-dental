-- Clinic desk: visit workflow statuses and reception notes.

alter type public.appointment_status add value if not exists 'arrived';
alter type public.appointment_status add value if not exists 'completed';
alter type public.appointment_status add value if not exists 'no_show';

alter table public.appointments
  add column if not exists notes text;
