-- Campaigns feature. Run this by hand in the Supabase SQL editor (same flow as
-- the other sql/ scripts). Column names are quoted camelCase to match the
-- existing schema (profileID, characterProfile, …).
--
-- A campaign is a party-like group (creator = the Dungeon Master) WITHOUT chat.
-- It is locked to one system via `gamemode`; only characters of that gamemode
-- can join. Players request to join with a specific character; the request is
-- `pending` until the DM accepts it.

create table if not exists public.campaigns (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    "dmID" text not null,                       -- auth user id of the DM/creator
    gamemode text not null,                     -- 'dnd' | 'daggerheart' (locks the system)
    description text,
    created_at timestamptz not null default now()
);

create table if not exists public."campaignCharacters" (
    id uuid primary key default gen_random_uuid(),
    "campaignID" uuid not null references public.campaigns(id) on delete cascade,
    "characterID" uuid not null references public.characters(id) on delete cascade,
    "profileID" text not null,                  -- player/owner user id (denormalized for "my requests")
    status text not null default 'pending',     -- 'pending' | 'accepted'
    created_at timestamptz not null default now()
);

-- A character can only be requested into a given campaign once.
create unique index if not exists campaign_character_unique
    on public."campaignCharacters" ("campaignID", "characterID");

create index if not exists campaign_characters_by_campaign
    on public."campaignCharacters" ("campaignID");
create index if not exists campaign_characters_by_profile
    on public."campaignCharacters" ("profileID");
