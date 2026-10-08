-- Campaign glyph + party order. Run by hand in the Supabase SQL editor after the
-- other campaign scripts. Safe to re-run.
--
-- • glyph: the sigil the GM picks when forging a campaign (older campaigns
--   without one fall back to a glyph derived from their id).
-- • sortOrder: the GM's drag-and-drop order of the party on the campaign page.
--   The GM already has UPDATE rights on campaignCharacters (the
--   "campaignCharacters: DM accepts" policy), so no new RLS is needed.
--
-- Deleting a campaign needs no changes either: the "campaigns: DM can delete" policy is
-- already on campaigns, and campaignCharacters rows go with it (on delete cascade).

alter table public.campaigns add column if not exists glyph text;
alter table public."campaignCharacters" add column if not exists "sortOrder" integer;
