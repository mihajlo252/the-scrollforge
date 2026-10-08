-- RLS policies for the Campaigns feature. Run after sql/add-campaigns.sql, by
-- hand in the Supabase SQL editor. Safe to re-run (drops before creating).
--
-- User ids are stored as text, so every comparison casts both sides to text.
--
-- Cross-table checks go through SECURITY DEFINER helper functions. That avoids
-- infinite recursion (a campaignCharacters policy that reads campaignCharacters)
-- and lets checks see rows the caller's own policies would hide.

-- ── Helper functions ────────────────────────────────────────────────────────

-- Am I the DM of this campaign?
create or replace function public.is_campaign_dm(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1 from public.campaigns c
		where c.id = cid and c."dmID"::text = auth.uid()::text
	);
$$;

-- Do I have an ACCEPTED character in this campaign?
create or replace function public.is_campaign_member(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1 from public."campaignCharacters" cc
		where cc."campaignID" = cid
		  and cc."profileID"::text = auth.uid()::text
		  and cc.status = 'accepted'
	);
$$;

-- Can I send this character to this campaign? It must be mine, and the same
-- system as the campaign (D&D can't join Daggerheart and vice versa).
create or replace function public.can_request_join(cid uuid, chid uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1
		from public.characters ch
		join public.campaigns c on c.id = cid
		where ch.id = chid
		  and ch."profileID"::text = auth.uid()::text
		  and ch.gamemode::text = c.gamemode::text  -- characters.gamemode is an enum
	);
$$;

-- Can I see this character because of a campaign?
--  • as the DM: any character with a request in my campaign (pending too, so I
--    can see who's asking to join)
--  • as a player: characters accepted into a campaign I'm accepted into
create or replace function public.can_view_campaign_character(chid uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1
		from public."campaignCharacters" cc
		join public.campaigns c on c.id = cc."campaignID"
		where cc."characterID" = chid
		  and (
			c."dmID"::text = auth.uid()::text
			or (cc.status = 'accepted' and public.is_campaign_member(c.id))
		  )
	);
$$;

-- Am I the DM of a campaign this character is accepted into? (inventory adds)
create or replace function public.is_dm_of_character(chid uuid)
returns boolean language sql stable security definer set search_path = public as $$
	select exists (
		select 1
		from public."campaignCharacters" cc
		join public.campaigns c on c.id = cc."campaignID"
		where cc."characterID" = chid
		  and cc.status = 'accepted'
		  and c."dmID"::text = auth.uid()::text
	);
$$;

grant execute on function public.is_campaign_dm(uuid) to authenticated;
grant execute on function public.is_campaign_member(uuid) to authenticated;
grant execute on function public.can_request_join(uuid, uuid) to authenticated;
grant execute on function public.can_view_campaign_character(uuid) to authenticated;
grant execute on function public.is_dm_of_character(uuid) to authenticated;

-- ── campaigns ───────────────────────────────────────────────────────────────

alter table public.campaigns enable row level security;

drop policy if exists "campaigns: anyone signed in can browse" on public.campaigns;
create policy "campaigns: anyone signed in can browse"
	on public.campaigns for select to authenticated
	using (true);

drop policy if exists "campaigns: create as yourself" on public.campaigns;
create policy "campaigns: create as yourself"
	on public.campaigns for insert to authenticated
	with check ("dmID"::text = auth.uid()::text);

drop policy if exists "campaigns: DM can edit" on public.campaigns;
create policy "campaigns: DM can edit"
	on public.campaigns for update to authenticated
	using ("dmID"::text = auth.uid()::text)
	with check ("dmID"::text = auth.uid()::text);

drop policy if exists "campaigns: DM can delete" on public.campaigns;
create policy "campaigns: DM can delete"
	on public.campaigns for delete to authenticated
	using ("dmID"::text = auth.uid()::text);

-- ── campaignCharacters ──────────────────────────────────────────────────────

alter table public."campaignCharacters" enable row level security;

-- See your own requests, every row of a campaign you run, and the roster of a
-- campaign you've been accepted into.
drop policy if exists "campaignCharacters: read" on public."campaignCharacters";
create policy "campaignCharacters: read"
	on public."campaignCharacters" for select to authenticated
	using (
		"profileID"::text = auth.uid()::text
		or public.is_campaign_dm("campaignID")
		or public.is_campaign_member("campaignID")
	);

-- Players request to join with their own, same-system character. Requests
-- always start pending — a player can't accept themselves in.
drop policy if exists "campaignCharacters: request to join" on public."campaignCharacters";
create policy "campaignCharacters: request to join"
	on public."campaignCharacters" for insert to authenticated
	with check (
		"profileID"::text = auth.uid()::text
		and status = 'pending'
		and public.can_request_join("campaignID", "characterID")
	);

-- Only the DM accepts requests.
drop policy if exists "campaignCharacters: DM accepts" on public."campaignCharacters";
create policy "campaignCharacters: DM accepts"
	on public."campaignCharacters" for update to authenticated
	using (public.is_campaign_dm("campaignID"))
	with check (public.is_campaign_dm("campaignID") and status in ('pending', 'accepted'));

-- The DM can reject/remove; a player can withdraw their own character.
drop policy if exists "campaignCharacters: remove" on public."campaignCharacters";
create policy "campaignCharacters: remove"
	on public."campaignCharacters" for delete to authenticated
	using (
		public.is_campaign_dm("campaignID")
		or "profileID"::text = auth.uid()::text
	);

-- ── characters (additions only) ─────────────────────────────────────────────
-- These ADD to whatever policies `characters` already has (permissive policies
-- are OR'd together), so owners keep full access to their own characters.
-- If RLS is disabled on `characters`, these do nothing until you enable it —
-- and in that case make sure an owner policy exists first (see the bottom).

drop policy if exists "characters: visible through campaigns" on public.characters;
create policy "characters: visible through campaigns"
	on public.characters for select to authenticated
	using (public.can_view_campaign_character(id));

drop policy if exists "characters: DM can add inventory" on public.characters;
create policy "characters: DM can add inventory"
	on public.characters for update to authenticated
	using (public.is_dm_of_character(id))
	with check (public.is_dm_of_character(id));

-- RLS can't limit WHICH columns an update touches, so the policy above would
-- let a DM change anything on a player's character. This trigger narrows it:
-- anyone who isn't the owner may only change `inventory` / `dhInventory`.
create or replace function public.enforce_non_owner_inventory_only()
returns trigger language plpgsql security definer set search_path = public as $$
begin
	-- Service role / SQL editor (no signed-in user) and the owner: unrestricted.
	if auth.uid() is null or old."profileID"::text = auth.uid()::text then
		return new;
	end if;
	if (to_jsonb(new) - 'inventory' - 'dhInventory') is distinct from
	   (to_jsonb(old) - 'inventory' - 'dhInventory') then
		raise exception 'Only the inventory of another player''s character can be changed';
	end if;
	return new;
end;
$$;

drop trigger if exists characters_non_owner_inventory_only on public.characters;
create trigger characters_non_owner_inventory_only
	before update on public.characters
	for each row execute function public.enforce_non_owner_inventory_only();

-- ── If `characters` doesn't have RLS on yet ─────────────────────────────────
-- Check with:
--   select relrowsecurity from pg_class where relname = 'characters';
-- If that returns false and you want to turn it on, add owner policies FIRST
-- or every existing screen loses access to its own characters:
--
-- create policy "characters: owner full access"
-- 	on public.characters for all to authenticated
-- 	using ("profileID"::text = auth.uid()::text)
-- 	with check ("profileID"::text = auth.uid()::text);
-- alter table public.characters enable row level security;
