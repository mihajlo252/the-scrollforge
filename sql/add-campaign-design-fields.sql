-- Fields the redesigned Campaign screens show. Run by hand in the Supabase SQL
-- editor after add-campaigns.sql and add-campaigns-rls.sql. Safe to re-run.
--
-- Display names are copied onto the rows when they're created, because the
-- client can't read other users' auth metadata (usernames live in
-- auth.users.raw_user_meta_data, which isn't exposed to the browser).

alter table public.campaigns add column if not exists "dmName" text;
alter table public.campaigns add column if not exists seats integer not null default 6;
alter table public."campaignCharacters" add column if not exists "playerName" text;

-- Backfill names for rows created before these columns existed.
update public.campaigns c
	set "dmName" = u.raw_user_meta_data ->> 'username'
	from auth.users u
	where u.id::text = c."dmID" and c."dmName" is null;

update public."campaignCharacters" cc
	set "playerName" = u.raw_user_meta_data ->> 'username'
	from auth.users u
	where u.id::text = cc."profileID" and cc."playerName" is null;

-- Browse cards show each campaign's party size, so ACCEPTED membership rows are
-- readable by anyone signed in (pending requests stay private to the DM and the
-- requesting player). This only exposes which character ids are seated where;
-- the characters themselves are still protected by their own policies.
drop policy if exists "campaignCharacters: read" on public."campaignCharacters";
create policy "campaignCharacters: read"
	on public."campaignCharacters" for select to authenticated
	using (
		status = 'accepted'
		or "profileID"::text = auth.uid()::text
		or public.is_campaign_dm("campaignID")
		or public.is_campaign_member("campaignID")
	);
