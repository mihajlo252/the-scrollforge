-- Campaign Acts: the GM's prepared story for a campaign. Run by hand in the
-- Supabase SQL editor AFTER sql/add-campaigns-rls.sql (it uses that file's
-- is_campaign_dm / is_campaign_member helpers). Safe to re-run.
--
-- An Act is an ordered list of modules (story, option, adversary, encounter)
-- kept in the `modules` jsonb array, the same way inventories live on
-- characters. Acts are the GM's secret prep: only the GM can read the table.
-- Players get what the GM revealed through get_revealed_campaign_acts(), which
-- strips everything except revealed story modules.

create table if not exists public."campaignActs" (
    id uuid primary key default gen_random_uuid(),
    "campaignID" uuid not null references public.campaigns(id) on delete cascade,
    title text not null,
    summary text,
    "sortOrder" integer,
    revealed boolean not null default false,  -- players can see this act
    modules jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists campaign_acts_by_campaign
    on public."campaignActs" ("campaignID");

create or replace function public.touch_campaign_act()
returns trigger language plpgsql as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists campaign_acts_touch on public."campaignActs";
create trigger campaign_acts_touch
	before update on public."campaignActs"
	for each row execute function public.touch_campaign_act();

-- ── RLS: the GM only ────────────────────────────────────────────────────────

alter table public."campaignActs" enable row level security;

drop policy if exists "campaignActs: GM reads" on public."campaignActs";
create policy "campaignActs: GM reads"
	on public."campaignActs" for select to authenticated
	using (public.is_campaign_dm("campaignID"));

drop policy if exists "campaignActs: GM creates" on public."campaignActs";
create policy "campaignActs: GM creates"
	on public."campaignActs" for insert to authenticated
	with check (public.is_campaign_dm("campaignID"));

drop policy if exists "campaignActs: GM edits" on public."campaignActs";
create policy "campaignActs: GM edits"
	on public."campaignActs" for update to authenticated
	using (public.is_campaign_dm("campaignID"))
	with check (public.is_campaign_dm("campaignID"));

drop policy if exists "campaignActs: GM deletes" on public."campaignActs";
create policy "campaignActs: GM deletes"
	on public."campaignActs" for delete to authenticated
	using (public.is_campaign_dm("campaignID"));

-- ── What players see ────────────────────────────────────────────────────────
-- Revealed acts of a campaign the caller is seated in (or runs), with
-- `modules` reduced to revealed story modules. Options, adversaries and
-- encounters never leave the database for players.

create or replace function public.get_revealed_campaign_acts(cid uuid)
returns setof public."campaignActs"
language sql stable security definer set search_path = public as $$
	select
		a.id,
		a."campaignID",
		a.title,
		a.summary,
		a."sortOrder",
		a.revealed,
		coalesce(
			(
				select jsonb_agg(e.m order by e.ord)
				from jsonb_array_elements(a.modules) with ordinality as e(m, ord)
				where e.m->>'type' = 'story'
				  and coalesce((e.m->>'revealed')::boolean, false)
			),
			'[]'::jsonb
		) as modules,
		a.created_at,
		a.updated_at
	from public."campaignActs" a
	where a."campaignID" = cid
	  and a.revealed
	  and (public.is_campaign_member(cid) or public.is_campaign_dm(cid));
$$;

grant execute on function public.get_revealed_campaign_acts(uuid) to authenticated;
