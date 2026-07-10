-- Persisted per-character sort position for the Profile character grid.
-- Drag-to-reorder writes each moved character's new index here; the Profile
-- screen orders characters by this column (unset values sort last, then by
-- created_at). Run once in the Supabase SQL editor.

alter table public.characters
  add column if not exists "sortOrder" integer;
