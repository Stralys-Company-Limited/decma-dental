-- SAMPLE opening hours so online booking can be tested before the real hours are confirmed.
-- Replace these with the clinic's confirmed hours (and keep lib/site.ts in step) before launch.
-- weekday: 0 = Sunday ... 6 = Saturday; times are EAT.

insert into public.opening_hours (weekday, opens, closes, slot_minutes) values
  (1, '08:00', '17:00', 30),
  (2, '08:00', '17:00', 30),
  (3, '08:00', '17:00', 30),
  (4, '08:00', '17:00', 30),
  (5, '08:00', '17:00', 30),
  (6, '09:00', '13:00', 30)
on conflict (weekday) do update
  set opens = excluded.opens, closes = excluded.closes, slot_minutes = excluded.slot_minutes;

-- To give a staff member admin access, create their user in Supabase Auth, then:
-- insert into public.staff (user_id, display_name) values ('<auth user id>', 'Reception');
