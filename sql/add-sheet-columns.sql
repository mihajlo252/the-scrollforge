-- The Scrollforge — adds columns for spell slots, inventory, currency, and structured traits.
-- Run this once against your Supabase "characters" table (SQL editor).
-- Column names are quoted camelCase to match the existing schema (characterProfile, currentHP, …).

alter table public.characters
  add column if not exists "spellSlots" jsonb not null default '{"ability":"int","slots":{}}'::jsonb,
  add column if not exists "inventory"  jsonb not null default '[]'::jsonb,
  add column if not exists "currency"   jsonb not null default '{"pp":0,"gp":0,"ep":0,"sp":0,"cp":0}'::jsonb,
  add column if not exists "traits"     jsonb not null default '[]'::jsonb;

-- Shapes the app expects:
--   spellSlots: { "ability": "int", "slots": { "1": { "total": 4, "used": 2 }, "2": { ... }, … } }
--   inventory:  [ { "name": "...", "type": "Weapon", "qty": 1, "wt": 2, "rarity": "rare",
--                   "equipped": true, "dmg": "1d6+4", "note": "" }, … ]
--   currency:   { "pp": 0, "gp": 0, "ep": 0, "sp": 0, "cp": 0 }
--   traits:     [ { "name": "...", "category": "Class Features", "sub": "4d6",
--                   "chips": ["Damage: 4d6"], "text": "..." }, … ]
