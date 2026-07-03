import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Dots, Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { SheetTabs } from "../../sections/DnD/CharacterProfile/SheetTabs";
import { calculateProficiencyBonus } from "../../utilities/calculateStats";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/dnd/spells")({
  component: Spells,
});

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
const ORDINAL = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

const emptySpell = (): Spell => ({
  name: "",
  type: "",
  castingTime: "",
  range: "",
  duration: "",
  components: "",
  description: "",
  level: 0,
  school: "",
  prepared: false,
});

const patchCharacter = (state: any, patch: Partial<Character>) => {
  localStorage.setItem(
    "character",
    JSON.stringify({ state: { ...state, character: { ...state.character, ...patch } }, version: 1 }),
  );
};

function Spells() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const character: Character = state.character;

  const [spells, setSpells] = useState<Spell[]>(character.descriptions.spells || []);
  const [slots, setSlots] = useState<SpellSlots>(character.spellSlots ?? { ability: "int", slots: {} });
  const [selected, setSelected] = useState<number>(0);
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showSlotEdit, setShowSlotEdit] = useState(false);
  const [form, setForm] = useState<Spell>(emptySpell());

  const level = character.characterProfile.level;
  const prof = parseInt(calculateProficiencyBonus({ level }) || "0");
  const abilityScore = (character.stats.primaryStats as any)[slots.ability] ?? 10;
  const abilityMod = Math.floor((abilityScore - 10) / 2);
  const saveDC = 8 + prof + abilityMod;
  const atk = prof + abilityMod;

  const persistSpells = async (next: Spell[]) => {
    setSpells(next);
    patchCharacter(state, { descriptions: { ...character.descriptions, spells: next } });
    await sendData("characters", character.id, { descriptions: { ...character.descriptions, spells: next } });
  };

  const persistSlots = async (next: SpellSlots) => {
    setSlots(next);
    patchCharacter(state, { spellSlots: next });
    await sendData("characters", character.id, { spellSlots: next });
  };

  const filtered = spells.filter((s) => levelFilter === "all" || (s.level ?? 0) === levelFilter);
  const sel = spells[selected];

  const slotLevels = Object.keys(slots.slots)
    .map(Number)
    .filter((lv) => slots.slots[lv]?.total > 0)
    .sort((a, b) => a - b);

  const castAt = async (lv: number) => {
    const s = slots.slots[lv];
    if (!s || s.used >= s.total) return;
    await persistSlots({ ...slots, slots: { ...slots.slots, [lv]: { ...s, used: s.used + 1 } } });
  };

  const restoreAll = async () => {
    const reset: Record<string, SpellSlotLevel> = {};
    Object.entries(slots.slots).forEach(([k, v]) => (reset[k] = { ...v, used: 0 }));
    await persistSlots({ ...slots, slots: reset });
  };

  const openAdd = () => {
    setForm(emptySpell());
    setEditIndex(null);
    setShowForm(true);
  };
  const openEdit = (i: number) => {
    setForm({ ...emptySpell(), ...spells[i] });
    setEditIndex(i);
    setShowForm(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    let next: Spell[];
    if (editIndex === null) {
      next = [...spells, form];
    } else {
      next = spells.map((s, i) => (i === editIndex ? form : s));
    }
    await persistSpells(next);
    setShowForm(false);
  };

  const deleteSpell = async (i: number) => {
    const next = spells.filter((_, idx) => idx !== i);
    await persistSpells(next);
    setSelected(0);
  };

  const setField = (name: keyof Spell, value: any) => setForm((p) => ({ ...p, [name]: value }));

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
      <SheetTabs active="spells" />

      {/* Spellcasting + slot rail */}
      <Frame classes="card">
        <div className="card-body">
          <div className={styles.castHeader}>
            <div>
              <div className="caps">Spellcasting</div>
              <div className={styles.castInfo}>
                <select className={`select ${styles.castSelect}`} value={slots.ability} onChange={(e) => persistSlots({ ...slots, ability: e.target.value })}>
                  {ABILITIES.map((a) => (
                    <option key={a} value={a}>{a.toUpperCase()}</option>
                  ))}
                </select>
                · Save DC <span className="mono" style={{ color: "var(--gold-2)" }}>{saveDC}</span> · Atk{" "}
                <span className="mono" style={{ color: "var(--gold-2)" }}>{atk >= 0 ? `+${atk}` : atk}</span>
              </div>
            </div>
            <div className={styles.vdiv} />
            <div className={styles.slotRail}>
              {slotLevels.length === 0 && <span className="caps" style={{ color: "var(--ink-faint)" }}>No slots set</span>}
              {slotLevels.map((lv) => {
                const s = slots.slots[lv];
                return (
                  <button
                    key={lv}
                    className={styles.slot}
                    data-active={levelFilter === lv ? "" : undefined}
                    onClick={() => setLevelFilter(levelFilter === lv ? "all" : lv)}
                  >
                    <div className="caps" style={{ fontSize: 9 }}>LV {lv}</div>
                    <Dots total={s.total} filled={s.total - s.used} size={11} color="var(--gold)" />
                    <div className="mono" style={{ fontSize: 11, color: "var(--ink-dim)" }}>{s.total - s.used}/{s.total}</div>
                  </button>
                );
              })}
            </div>
            <div className={styles.spacer} />
            <button className="button button-ghost short" onClick={restoreAll} type="button">
              <Icon name="moon" size={12} /> Restore
            </button>
            <button className="button button-ghost short" onClick={() => setShowSlotEdit(true)} type="button">
              <Icon name="gear" size={12} /> Slots
            </button>
            <button className="button button-primary short" onClick={openAdd} type="button">
              <Icon name="plus" size={12} /> Add Spell
            </button>
          </div>
        </div>
      </Frame>

      <div className={styles.spellGrid}>
        {/* Spellbook */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Spellbook</div>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-dim)" }}>{filtered.length} spells</span>
          </div>
          <div className={styles.spellListBody}>
            {spells.length === 0 && <div className={styles.spellGroupLabel}>No spells yet — add one.</div>}
            {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((lv) => {
              const group = filtered
                .map((s) => ({ s, i: spells.indexOf(s) }))
                .filter(({ s }) => (s.level ?? 0) === lv);
              if (!group.length) return null;
              return (
                <div key={lv} style={{ marginBottom: 10 }}>
                  <div className={`caps ${styles.spellGroupLabel}`}>{lv === 0 ? "Cantrips" : `Level ${lv}`}</div>
                  {group.map(({ s, i }) => (
                    <button key={i} className={styles.spellItem} data-active={selected === i ? "" : undefined} onClick={() => setSelected(i)}>
                      <span className={styles.spellItemBar} style={{ background: (s.level ?? 0) === 0 ? "var(--ink-faint)" : "var(--gold)", opacity: s.prepared ? 1 : 0.35 }} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className={styles.spellItemName}>{s.name}</span>
                        <span className={styles.spellItemSchool}>{[s.school, s.type].filter(Boolean).join(" · ")}</span>
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </Frame>

        {/* Detail */}
        <Frame classes="card">
          {!sel ? (
            <div className={styles.spellDetailEmpty}>Select a spell to view its details.</div>
          ) : (
            <div className={styles.spellDetail}>
              <div className={styles.spellDetailHead}>
                <div className={styles.spellAvatar}>{sel.name?.[0] ?? "?"}</div>
                <div style={{ flex: 1 }}>
                  <div className={styles.spellTitleRow}>
                    <h2 className={styles.spellTitle}>{sel.name}</h2>
                    {sel.prepared && <span className="chip chip-gold">Prepared</span>}
                  </div>
                  <div className={styles.spellSub}>
                    {(sel.level ?? 0) === 0 ? "Cantrip" : `${ORDINAL(sel.level ?? 0)}-level`} {sel.school?.toLowerCase()}
                  </div>
                </div>
                <div className={styles.spellActions}>
                  <button className="button button-ghost short" onClick={() => openEdit(selected)} type="button">
                    <Icon name="edit" size={13} /> Edit
                  </button>
                  <ConfirmButton className="button button-secondary short" aria-label="Delete spell" title="Delete spell?" message="Remove this spell? This can't be undone." onConfirm={() => deleteSpell(selected)}>
                    <Icon name="trash" size={13} />
                  </ConfirmButton>
                </div>
              </div>

              <div className={styles.spellStatStrip}>
                {[
                  ["Range", sel.range],
                  ["Casting Time", sel.castingTime],
                  ["Duration", sel.duration],
                  ["Components", sel.components],
                ].map(([label, value]) => (
                  <div key={label} className={styles.spellStat}>
                    <div className="caps" style={{ fontSize: 9, marginBottom: 2 }}>{label}</div>
                    <div className={styles.spellStatVal}>{value || "—"}</div>
                  </div>
                ))}
              </div>

              <p className={styles.spellText}>{sel.description}</p>

              {(sel.level ?? 0) > 0 && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed var(--rule)", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="caps">Cast at</span>
                  {[sel.level!, sel.level! + 1, sel.level! + 2]
                    .filter((l) => l <= 9 && slots.slots[l]?.total > 0)
                    .map((l) => {
                      const s = slots.slots[l];
                      const spent = s.used >= s.total;
                      return (
                        <button key={l} className="button button-ghost short" disabled={spent} onClick={() => castAt(l)} type="button">
                          Level {l} ({s.total - s.used}/{s.total})
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </Frame>
      </div>

      {/* Add / Edit spell */}
      <Popup closerFunc={setShowForm} toggle={showForm}>
        <form onSubmit={submitForm} className={styles.addForm}>
          <Frame classes={styles.addFrame}>
            <h3 className="card-title">{editIndex === null ? "Add Spell" : "Edit Spell"}</h3>
            <input className="input" placeholder="Spell Name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            <div className={styles.formRow}>
              <select className="select" value={form.level ?? 0} onChange={(e) => setField("level", parseInt(e.target.value))}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
                  <option key={l} value={l}>{l === 0 ? "Cantrip" : `Level ${l}`}</option>
                ))}
              </select>
              <input className="input" placeholder="School" value={form.school ?? ""} onChange={(e) => setField("school", e.target.value)} />
            </div>
            <input className="input" placeholder="Type" value={form.type} onChange={(e) => setField("type", e.target.value)} />
            <div className={styles.formRow}>
              <input className="input" placeholder="Casting Time" value={form.castingTime} onChange={(e) => setField("castingTime", e.target.value)} />
              <input className="input" placeholder="Range" value={form.range} onChange={(e) => setField("range", e.target.value)} />
            </div>
            <div className={styles.formRow}>
              <input className="input" placeholder="Duration" value={form.duration} onChange={(e) => setField("duration", e.target.value)} />
              <input className="input" placeholder="Components" value={form.components} onChange={(e) => setField("components", e.target.value)} />
            </div>
            <textarea className="textarea" placeholder="Description" rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} />
            <label className={styles.checkRow}>
              <input type="checkbox" checked={!!form.prepared} onChange={(e) => setField("prepared", e.target.checked)} /> Prepared
            </label>
            <div className={styles.formRow}>
              <button type="submit" className="button button-accent stretch">{editIndex === null ? "Add" : "Save"}</button>
              <button type="button" className="button button-secondary stretch" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>

      {/* Edit slots */}
      <Popup closerFunc={setShowSlotEdit} toggle={showSlotEdit}>
        <Frame classes={styles.addFrame}>
          <h3 className="card-title">Spell Slots</h3>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lv) => (
            <div key={lv} className={styles.formRow} style={{ alignItems: "center" }}>
              <span className="caps">Level {lv}</span>
              <input
                type="number"
                className="input"
                min={0}
                value={slots.slots[lv]?.total ?? 0}
                onChange={(e) => {
                  const total = parseInt(e.target.value) || 0;
                  const used = Math.min(slots.slots[lv]?.used ?? 0, total);
                  setSlots({ ...slots, slots: { ...slots.slots, [lv]: { total, used } } });
                }}
              />
            </div>
          ))}
          <div className={styles.formRow}>
            <button type="button" className="button button-accent stretch" onClick={() => { persistSlots(slots); setShowSlotEdit(false); }}>Save</button>
            <button type="button" className="button button-secondary stretch" onClick={() => setShowSlotEdit(false)}>Close</button>
          </div>
        </Frame>
      </Popup>
    </motion.section>
  );
}
