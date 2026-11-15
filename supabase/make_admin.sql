-- Run AFTER you have created the admin user in Supabase -> Authentication -> Users.
-- Replace the email below with that user's email, then run.
insert into public.admins (user_id)
select id from auth.users where email = 'REPLACE-WITH-ADMIN-EMAIL'
on conflict do nothing;

-- Check it worked: this should return one row.
select user_id from public.admins;
