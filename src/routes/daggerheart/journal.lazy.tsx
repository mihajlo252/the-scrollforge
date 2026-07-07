import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { SheetShell } from "../../sections/Daggerheart/CharacterProfile/SheetShell";
import { getSubclass, tierForLevel } from "../../utilities/daggerheart";
import { patchCharacter } from "../../utilities/patchCharacter";
import { queueCharacterSave } from "../../utilities/autosaveCharacter";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/daggerheart/journal")({
  component: Journal,
});

const TIERS = [
  { n: 1, label: "Level 1" },
  { n: 2, label: "Levels 2-4" },
  { n: 3, label: "Levels 5-7" },
  { n: 4, label: "Levels 8-10" },
];

/** Module-level (NOT inline in JournalBody): an inline component gets a new
 *  identity every render, so React would remount the whole card — a visible
 *  flicker on each keystroke while the edit popup is open. */
const BioSection = ({
  title,
  k,
  entries,
  onAdd,
  onEdit,
  onRemove,
}: {
  title: string;
  k: keyof DHBio;
  entries: DHBioEntry[];
  onAdd: (k: keyof DHBio) => void;
  onEdit: (k: keyof DHBio, i: number) => void;
  onRemove: (k: keyof DHBio, i: number) => void;
}) => (
  <Frame classes="card">
    <div className="card-hdr">
      <div className="card-title">{title}</div>
      <button className="button button-primary short" type="button" onClick={() => onAdd(k)}>
        <Icon name="plus" size={12} /> Add
      </button>
    </div>
    <div className="card-body">
      <div className={styles.section}>
        {entries.length === 0 ? (
          <span className={styles.empty}>Nothing written yet.</span>
        ) : (
          entries.map((entry, i) => (
            <div key={i} className={styles.bioEntry}>
              <div className={styles.bioQ}>
                <span className={styles.bioQText}>{entry.q}</span>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button className="sf-icon-btn" type="button" onClick={() => onEdit(k, i)} aria-label="Edit"><Icon name="edit" size={13} /></button>
                  <ConfirmButton className="sf-icon-btn" aria-label="Remove" title="Delete entry?" message="Remove this entry? This can't be undone." onConfirm={() => onRemove(k, i)}><Icon name="trash" size={13} /></ConfirmButton>
                </div>
              </div>
              {entry.a ? <div className={styles.featureText}>{entry.a}</div> : <span className={styles.empty}>Not answered yet.</span>}
            </div>
          ))
        )}
      </div>
    </div>
  </Frame>
);

function JournalBody({ character, state, openLevelUp }: { character: DaggerheartCharacter; state: any; openLevelUp: () => void }) {
  const profile = character.characterProfile;
  const subclass = getSubclass(profile.subclass);
  const level = profile.level || 1;
  const tier = tierForLevel(level);
  const multiclass = character.dhAdvancements?.multiclass;

  const [bio, setBio] = useState<DHBio>(character.dhBio ?? { background: [], connections: [] });

  // Entries are edited through a popup form (like inventory items) so nothing
  // is persisted until Save — inline inputs would fire a write per keystroke.
  const [bioEdit, setBioEdit] = useState<{ key: keyof DHBio; index: number | null } | null>(null);
  const [bioForm, setBioForm] = useState<DHBioEntry>({ q: "", a: "" });

  const persist = (next: DHBio) => {
    setBio(next);
    patchCharacter(state, { dhBio: next });
    queueCharacterSave(character.id, { dhBio: next });
  };

  const openBioAdd = (key: keyof DHBio) => {
    setBioForm({ q: "", a: "" });
    setBioEdit({ key, index: null });
  };
  const openBioEdit = (key: keyof DHBio, i: number) => {
    setBioForm({ ...bio[key][i] });
    setBioEdit({ key, index: i });
  };
  const saveBio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioEdit || !bioForm.q.trim()) return;
    const list = bioEdit.index === null ? [...bio[bioEdit.key], bioForm] : bio[bioEdit.key].map((x, i) => (i === bioEdit.index ? bioForm : x));
    persist({ ...bio, [bioEdit.key]: list });
    setBioEdit(null);
  };
  const removeEntry = (key: keyof DHBio, i: number) =>
    persist({ ...bio, [key]: bio[key].filter((_, idx) => idx !== i) });

  const advHistory = Object.entries(character.dhAdvancements?.perLevel ?? {}).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  return (
    <>
      {/* Identity + tier */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">{profile.name}</div>
          <span className="caps" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
            LV {level} · {profile.ancestry} {profile.community} · {profile.class}{subclass ? ` (${subclass.name})` : ""}
            {multiclass ? ` / ${multiclass.class}` : ""}
          </span>
        </div>
        <div className="card-body">
          <div className={styles.tierBar}>
            {TIERS.map((t) => (
              <div key={t.n} className={styles.tierStep} data-active={t.n === tier ? "true" : undefined}>
                <span className={styles.tierStepN}>T{t.n}</span>
                <span className={styles.tierStepL}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>

      <BioSection title="Background" k="background" entries={bio.background} onAdd={openBioAdd} onEdit={openBioEdit} onRemove={removeEntry} />
      <BioSection title="Connections" k="connections" entries={bio.connections} onAdd={openBioAdd} onEdit={openBioEdit} onRemove={removeEntry} />

      {/* Advancement */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Advancement</div>
          <button className="button button-accent short" type="button" onClick={openLevelUp} disabled={level >= 10}>
            <Icon name="crown" size={13} /> {level >= 10 ? "Max Level" : "Level Up"}
          </button>
        </div>
        <div className="card-body">
          {advHistory.length === 0 ? (
            <span className={styles.empty}>No advancements taken yet.</span>
          ) : (
            <div className={styles.advHistory}>
              {advHistory.map(([lvl, picks]) => (
                <div key={lvl} className={styles.advHistoryRow}>
                  <span className="chip chip-gold">LV {lvl}</span>
                  <span>{(picks ?? []).map((p) => p.label).join(" · ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Frame>

      {/* Background / Connections entry form */}
      <Popup closerFunc={() => setBioEdit(null)} toggle={bioEdit !== null}>
        <form onSubmit={saveBio}>
          <Frame classes="column-direction">
            <h3 className="card-title">
              {bioEdit?.index === null ? "Add" : "Edit"} {bioEdit?.key === "connections" ? "Connection" : "Background"} Entry
            </h3>
            <input className="input" placeholder="Prompt / question" value={bioForm.q} autoFocus onChange={(e) => setBioForm({ ...bioForm, q: e.target.value })} required />
            <textarea className="textarea" rows={4} placeholder="Your answer" value={bioForm.a} onChange={(e) => setBioForm({ ...bioForm, a: e.target.value })} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="button button-accent stretch">{bioEdit?.index === null ? "Add" : "Save"}</button>
              <button type="button" className="button button-secondary stretch" onClick={() => setBioEdit(null)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>
    </>
  );
}

function Journal() {
  return <SheetShell active="character">{(ctx) => <JournalBody {...ctx} />}</SheetShell>;
}
