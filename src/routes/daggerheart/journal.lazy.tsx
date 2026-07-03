import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { SheetShell } from "../../sections/Daggerheart/CharacterProfile/SheetShell";
import { getSubclass, tierForLevel } from "../../utilities/daggerheart";
import { patchCharacter } from "../../utilities/patchCharacter";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/daggerheart/journal")({
  component: Journal,
});

const TIERS = [
  { n: 1, label: "Level 1" },
  { n: 2, label: "Levels 2–4" },
  { n: 3, label: "Levels 5–7" },
  { n: 4, label: "Levels 8–10" },
];

function JournalBody({ character, state, openLevelUp }: { character: DaggerheartCharacter; state: any; openLevelUp: () => void }) {
  const profile = character.characterProfile;
  const subclass = getSubclass(profile.subclass);
  const level = profile.level || 1;
  const tier = tierForLevel(level);
  const multiclass = character.dhAdvancements?.multiclass;

  const [bio, setBio] = useState<DHBio>(character.dhBio ?? { background: [], connections: [] });

  const persist = (next: DHBio) => {
    setBio(next);
    patchCharacter(state, { dhBio: next });
    sendData("characters", character.id, { dhBio: next });
  };

  const editAnswer = (key: keyof DHBio, i: number, a: string) =>
    persist({ ...bio, [key]: bio[key].map((x, idx) => (idx === i ? { ...x, a } : x)) });
  const addEntry = (key: keyof DHBio) => persist({ ...bio, [key]: [...bio[key], { q: "New prompt", a: "" }] });
  const editQuestion = (key: keyof DHBio, i: number, q: string) =>
    persist({ ...bio, [key]: bio[key].map((x, idx) => (idx === i ? { ...x, q } : x)) });
  const removeEntry = (key: keyof DHBio, i: number) =>
    persist({ ...bio, [key]: bio[key].filter((_, idx) => idx !== i) });

  const advHistory = Object.entries(character.dhAdvancements?.perLevel ?? {}).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  const BioSection = ({ title, k }: { title: string; k: keyof DHBio }) => (
    <Frame classes="card">
      <div className="card-hdr">
        <div className="card-title">{title}</div>
        <button className="button button-primary short" type="button" onClick={() => addEntry(k)}>
          <Icon name="plus" size={12} /> Add
        </button>
      </div>
      <div className="card-body">
        <div className={styles.section}>
          {bio[k].length === 0 ? (
            <span className={styles.empty}>Nothing written yet.</span>
          ) : (
            bio[k].map((entry, i) => (
              <div key={i} className={styles.bioEntry}>
                <div className={styles.bioQ}>
                  <input className={`input ${styles.bioQText}`} value={entry.q} onChange={(e) => editQuestion(k, i, e.target.value)} />
                  <ConfirmButton className="sf-icon-btn" aria-label="Remove" title="Delete entry?" message="Remove this entry? This can't be undone." onConfirm={() => removeEntry(k, i)}><Icon name="trash" size={13} /></ConfirmButton>
                </div>
                <textarea className="textarea" rows={2} value={entry.a} onChange={(e) => editAnswer(k, i, e.target.value)} />
              </div>
            ))
          )}
        </div>
      </div>
    </Frame>
  );

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

      <BioSection title="Background" k="background" />
      <BioSection title="Connections" k="connections" />

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
    </>
  );
}

function Journal() {
  return <SheetShell active="character">{(ctx) => <JournalBody {...ctx} />}</SheetShell>;
}
