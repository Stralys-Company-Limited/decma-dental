-- DECMA Dental Clinic: bookings, call-backs, referrals and staff access.
-- Website server code uses the service-role key (bypasses RLS). The anon role gets no access at all;
-- signed-in staff (listed in public.staff) can read and manage everything through RLS policies.

create extension if not exists pgcrypto;

-- Staff -----------------------------------------------------------------------------------------

create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- Opening hours and closures ---------------------------------------------------------------------

-- weekday: 0 = Sunday ... 6 = Saturday. Times are clinic wall-clock time (Africa/Dar_es_Salaam, EAT).
create table public.opening_hours (
  weekday smallint primary key check (weekday between 0 and 6),
  opens time not null,
  closes time not null,
  slot_minutes smallint not null default 30 check (slot_minutes between 5 and 240),
  check (closes > opens)
);

create table public.closures (
  day date primary key,
  reason text,
  created_at timestamptz not null default now()
);

-- Appointments -----------------------------------------------------------------------------------

create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled');

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  -- Patient-facing appointment number (8 random digits, shown as DC-1234-5678). The unique constraint
  -- guarantees a number is never reused; the app draws a new one if it ever collides.
  reference text not null unique check (reference ~ '^[0-9]{8}$'),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  appointment_type text not null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 30),
  email text not null check (char_length(email) between 3 and 200),
  locale text not null default 'en' check (locale in ('en', 'sw')),
  consent_at timestamptz not null,
  status public.appointment_status not null default 'confirmed',
  manage_token uuid not null unique default gen_random_uuid(),
  reminder_sent_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- One active booking per slot. Cancelled bookings free the slot.
create unique index appointments_one_per_slot on public.appointments (starts_at) where status <> 'cancelled';
create index appointments_starts_at on public.appointments (starts_at);
create index appointments_reminders on public.appointments (starts_at)
  where status = 'confirmed' and reminder_sent_at is null;

-- Call-back and referral requests ----------------------------------------------------------------

create table public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  appointment_type text not null,
  preferred_date date,
  locale text not null default 'en',
  consent_at timestamptz not null,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.referral_requests (
  id uuid primary key default gen_random_uuid(),
  practitioner_name text not null,
  practice text not null,
  phone text not null,
  email text not null,
  message text not null check (char_length(message) <= 2000),
  locale text not null default 'en',
  consent_at timestamptz not null,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

-- Rate limiting (IP addresses are stored as salted hashes only) -----------------------------------

create table public.submission_log (
  id bigint generated always as identity primary key,
  kind text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index submission_log_lookup on public.submission_log (kind, ip_hash, created_at desc);

-- Row-level security -----------------------------------------------------------------------------

alter table public.staff enable row level security;
alter table public.opening_hours enable row level security;
alter table public.closures enable row level security;
alter table public.appointments enable row level security;
alter table public.callback_requests enable row level security;
alter table public.referral_requests enable row level security;
alter table public.submission_log enable row level security;

create policy "staff read own row" on public.staff
  for select to authenticated using (user_id = auth.uid());

create policy "staff manage opening hours" on public.opening_hours
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage closures" on public.closures
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage appointments" on public.appointments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage call-backs" on public.callback_requests
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage referrals" on public.referral_requests
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- submission_log: no policies, so only the service role can use it.

revoke all on all tables in schema public from anon;
