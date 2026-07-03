import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { SheetTabs } from "../../sections/DnD/CharacterProfile/SheetTabs";
import { calculateProficiencyBonus } from "../../utilities/calculateStats";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/dnd/attacks")({
  component: Attacks,
});

const emptyAttack = (): Attack => ({
  name: "",
  type: "",
  range: "",
  attack: "",
  damage: "",
  description: "",
});

const patchCharacter = (state: any, patch: Partial<Character>) => {
  localStorage.setItem(
    "character",
    JSON.stringify({ state: { ...state, character: { ...state.character, ...patch } }, version: 1 }),
  );
};

function Attacks() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const character: Character = state.character;

  const [attacks, setAttacks] = useState<Attack[]>(character.descriptions.attacks || []);
  const [selected, setSelected] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Attack>(emptyAttack());

  const prof = calculateProficiencyBonus({ level: character.characterProfile.level }) ?? "2";

  const persist = async (next: Attack[]) => {
    setAttacks(next);
    patchCharacter(state, { descriptions: { ...character.descriptions, attacks: next } });
    await sendData("characters", character.id, { descriptions: { ...character.descriptions, attacks: next } });
  };

  const sel = attacks[selected];

  const openAdd = () => {
    setForm(emptyAttack());
    setEditIndex(null);
    setShowForm(true);
  };
  const openEdit = (i: number) => {
    setForm({ ...emptyAttack(), ...attacks[i] });
    setEditIndex(i);
    setShowForm(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = editIndex === null ? [...attacks, form] : attacks.map((a, i) => (i === editIndex ? form : a));
    await persist(next);
    setShowForm(false);
  };

  const deleteAttack = async (i: number) => {
    const next = attacks.filter((_, idx) => idx !== i);
    await persist(next);
    setSelected(0);
  };

  const setField = (name: keyof Attack, value: any) => setForm((p) => ({ ...p, [name]: value }));

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
      <SheetTabs active="attacks" />

      {/* Header */}
      <Frame classes="card">
        <div className="card-body">
          <div className={styles.castHeader}>
            <div>
              <div className="caps">Attacks &amp; Actions</div>
              <div className={styles.castInfo}>
                Proficiency <span className="mono" style={{ color: "var(--gold-2)" }}>+{prof}</span> · {attacks.length}{" "}
                {attacks.length === 1 ? "action" : "actions"}
              </div>
            </div>
            <div className={styles.spacer} />
            <button className="button button-primary short" onClick={openAdd} type="button">
              <Icon name="plus" size={12} /> Add Attack
            </button>
          </div>
        </div>
      </Frame>

      <div className={styles.spellGrid}>
        {/* List */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Arsenal</div>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-dim)" }}>{attacks.length}</span>
          </div>
          <div className={styles.spellListBody}>
            {attacks.length === 0 && <div className={styles.spellGroupLabel}>No attacks yet — add one.</div>}
            {attacks.map((a, i) => (
              <button key={i} className={styles.spellItem} data-active={selected === i ? "" : undefined} onClick={() => setSelected(i)}>
                <span className={styles.spellItemBar} style={{ background: "var(--ember)" }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className={styles.spellItemName}>{a.name}</span>
                  <span className={styles.spellItemSchool}>{[a.type, a.damage].filter(Boolean).join(" · ")}</span>
                </span>
              </button>
            ))}
          </div>
        </Frame>

        {/* Detail */}
        <Frame classes="card">
          {!sel ? (
            <div className={styles.spellDetailEmpty}>Select an attack to view its details.</div>
          ) : (
            <div className={styles.spellDetail}>
              <div className={styles.spellDetailHead}>
                <div className={`${styles.spellAvatar} ${styles.attackAvatar}`}>
                  <Icon name="sword" size={30} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.spellTitleRow}>
                    <h2 className={styles.spellTitle}>{sel.name}</h2>
                    {sel.type && <span className="chip chip-ember">{sel.type}</span>}
                  </div>
                  {sel.range && <div className={styles.spellSub}>{sel.range}</div>}
                </div>
                <div className={styles.spellActions}>
                  <button className="button button-ghost short" onClick={() => openEdit(selected)} type="button">
                    <Icon name="edit" size={13} /> Edit
                  </button>
                  <ConfirmButton className="button button-secondary short" aria-label="Delete attack" title="Delete attack?" message="Remove this attack? This can't be undone." onConfirm={() => deleteAttack(selected)}>
                    <Icon name="trash" size={13} />
                  </ConfirmButton>
                </div>
              </div>

              <div className={styles.spellStatStrip}>
                {[
                  ["Attack", sel.attack],
                  ["Damage", sel.damage],
                  ["Range", sel.range],
                  ["Type", sel.type],
                ].map(([label, value]) => (
                  <div key={label} className={styles.spellStat}>
                    <div className="caps" style={{ fontSize: 9, marginBottom: 2 }}>{label}</div>
                    <div className={styles.spellStatVal}>{value || "—"}</div>
                  </div>
                ))}
              </div>

              {sel.description ? (
                <p className={styles.spellText}>{sel.description}</p>
              ) : (
                <div className={styles.attackEmpty}>No description.</div>
              )}
            </div>
          )}
        </Frame>
      </div>

      {/* Add / Edit */}
      <Popup closerFunc={setShowForm} toggle={showForm}>
        <form onSubmit={submitForm} className={styles.addForm}>
          <Frame classes={styles.addFrame}>
            <h3 className="card-title">{editIndex === null ? "Add Attack" : "Edit Attack"}</h3>
            <input className="input" placeholder="Attack Name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            <div className={styles.formRow}>
              <input className="input" placeholder="Type (Melee, Ranged…)" value={form.type} onChange={(e) => setField("type", e.target.value)} />
              <input className="input" placeholder="Range" value={form.range} onChange={(e) => setField("range", e.target.value)} />
            </div>
            <div className={styles.formRow}>
              <input className="input" placeholder="Attack Bonus (e.g. +5)" value={form.attack} onChange={(e) => setField("attack", e.target.value)} />
              <input className="input" placeholder="Damage (e.g. 1d8+3)" value={form.damage} onChange={(e) => setField("damage", e.target.value)} />
            </div>
            <textarea className="textarea" placeholder="Description" rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} />
            <div className={styles.formRow}>
              <button type="submit" className="button button-accent stretch">{editIndex === null ? "Add" : "Save"}</button>
              {editIndex !== null && (
                <button type="button" className="button button-secondary stretch" onClick={() => { deleteAttack(editIndex); setShowForm(false); }}>Delete</button>
              )}
              <button type="button" className="button button-secondary stretch" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>
    </motion.section>
  );
}
