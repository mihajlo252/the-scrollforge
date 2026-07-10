-- The Scrollforge — adds the Daggerheart sheet columns.
-- Run this once against your Supabase "characters" table (SQL editor).
-- Column names are quoted camelCase to match the existing schema
-- (characterProfile, currentHP, spellSlots, inventory, …).
--
-- These are read ONLY by the Daggerheart screens; D&D characters ignore them.
-- Daggerheart characters do NOT use the D&D `stats` column.

alter table public.characters
  add column if not exists "dhTraits"       jsonb not null default '{"Agility":0,"Strength":0,"Finesse":0,"Instinct":0,"Presence":0,"Knowledge":0}'::jsonb,
  add column if not exists "dhVitals"        jsonb not null default '{"evasion":10,"proficiency":1,"armorScore":0,"armorSlots":{"total":0,"marked":0},"hp":{"total":6,"marked":0,"major":0,"severe":0},"stress":{"total":6,"marked":0},"hope":{"total":6,"marked":0},"conditions":[]}'::jsonb,
  add column if not exists "dhDomainCards"   jsonb not null default '{"loadout":[],"vault":[]}'::jsonb,
  add column if not exists "dhExperiences"   jsonb not null default '[]'::jsonb,
  add column if not exists "dhWeapons"        jsonb not null default '{"primary":null,"secondary":null}'::jsonb,
  add column if not exists "dhArmor"          jsonb not null default 'null'::jsonb,
  add column if not exists "dhInventory"      jsonb not null default '[]'::jsonb,
  add column if not exists "dhGold"           jsonb not null default '{"handfuls":0,"bags":0,"chest":0}'::jsonb,
  add column if not exists "dhBio"            jsonb not null default '{"background":[],"connections":[]}'::jsonb,
  add column if not exists "dhAdvancements"   jsonb not null default '{"markedTraits":[],"perLevel":{},"subclassUnlocked":{"specialization":false,"mastery":false}}'::jsonb;

-- Shapes the app expects:
--   dhTraits:      { "Agility": 0, "Strength": 1, "Finesse": 2, "Instinct": -1, "Presence": 1, "Knowledge": 0 }  (trait modifiers)
--   dhVitals:      { "evasion": 10, "proficiency": 1, "armorScore": 3,
--                    "armorSlots": { "total": 3, "marked": 0 },
--                    "hp":     { "total": 6, "marked": 0, "major": 7, "severe": 13 },
--                    "stress": { "total": 6, "marked": 0 },
--                    "hope":   { "total": 6, "marked": 2 },
--                    "conditions": ["Vulnerable"] }
--   dhDomainCards: { "loadout": [ { "name": "...", "domain": "GRACE", "level": 1,
--                                   "type": "Spell", "recall": 1, "text": "..." }, … ],
--                    "vault":   [ … ] }              -- loadout capped at 5 by the UI
--   dhExperiences: [ { "name": "Silver Tongue", "bonus": 2 }, … ]
--   dhWeapons:     { "primary":   { "name": "...", "trait": "Agility", "range": "Melee",
--                                   "damage": "1d8+1", "dtype": "phy", "burden": "One-Handed",
--                                   "feature": "..." } | null,
--                    "secondary": { … } | null }
--   dhArmor:       { "name": "...", "score": 3, "thresholds": { "major": 7, "severe": 13 },
--                    "feature": "..." } | null
--   dhInventory:   [ { "name": "...", "qty": 1, "note": "" }, … ]
--   dhGold:        { "handfuls": 5, "bags": 1, "chest": 0 }
--   dhBio:         { "background":  [ { "q": "...", "a": "..." }, … ],
--                    "connections": [ { "q": "...", "a": "..." }, … ] }
--   dhAdvancements:{ "markedTraits": ["Agility"],
--                    "perLevel": { "2": [ { "id": "trait", "label": "...", … } ], … },
--                    "subclassUnlocked": { "specialization": false, "mastery": false },
--                    "multiclass": { "class": "ROGUE", "domain": "MIDNIGHT" } }
