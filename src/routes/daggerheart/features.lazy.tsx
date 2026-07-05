import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { SheetShell } from "../../sections/Daggerheart/CharacterProfile/SheetShell";
import { getAncestry, getClass, getCommunity, getSubclass, flattenDescription, type Feature } from "../../utilities/daggerheart";
import { patchCharacter } from "../../utilities/patchCharacter";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/daggerheart/features")({
  component: Features,
});

const FeatureCard = ({ feature, locked, unlockHint, span }: { feature: Feature; locked?: boolean; unlockHint?: string; span?: boolean }) => (
  <div className={`${styles.featCard} ${span ? styles.featSpan : ""}`} data-locked={locked ? "" : undefined}>
    <div className={styles.featHead}>
      <span className={styles.featName}>{feature.name}</span>
      {locked && <span className="chip">{unlockHint}</span>}
    </div>
    <div className={styles.featureText}>{flattenDescription(feature.description)}</div>
  </div>
);

function FeaturesBody({ character, state }: { character: DaggerheartCharacter; state: any }) {
  const profile = character.characterProfile;
  const cls = getClass(profile.class);
  const subclass = getSubclass(profile.subclass);
  const ancestry = getAncestry(profile.ancestry);
  const community = getCommunity(profile.community);
  const level = profile.level || 1;
  const unlocked = character.dhAdvancements?.subclassUnlocked ?? { specialization: false, mastery: false };
  const specUnlocked = unlocked.specialization || level >= 5;
  const masteryUnlocked = unlocked.mastery || level >= 8;

  const [experiences, setExperiences] = useState<DHExperience[]>(character.dhExperiences ?? []);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<DHExperience>({ name: "", bonus: 2 });

  const persist = (next: DHExperience[]) => {
    setExperiences(next);
    patchCharacter(state, { dhExperiences: next });
    sendData("characters", character.id, { dhExperiences: next });
  };

  const openAdd = () => {
    setForm({ name: "", bonus: 2 });
    setEditIndex(null);
    setShowForm(true);
  };
  const openEdit = (i: number) => {
    setForm({ ...experiences[i] });
    setEditIndex(i);
    setShowForm(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const next = editIndex === null ? [...experiences, form] : experiences.map((x, i) => (i === editIndex ? form : x));
    persist(next);
    setShowForm(false);
  };

  return (
    <>
      {/* Class features */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">{profile.class ?? cls?.name } Features</div>
        </div>
        <div className="card-body">
          <div className={styles.featGrid}>
            {(cls?.classFeatures ?? []).map((f) => (
              <FeatureCard key={f.name} feature={f} />
            ))}
            {cls?.hopeFeature && <FeatureCard feature={cls.hopeFeature} span />}
          </div>
        </div>
      </Frame>

      {/* Subclass tiers */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">{subclass?.name ?? "Subclass"}</div>
          <span className="caps" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
            {subclass?.spellcastTrait ? `Spellcast: ${subclass.spellcastTrait}` : "Martial"}
          </span>
        </div>
        <div className="card-body">
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Foundation</span>
            <div className={styles.featGrid}>
              {(subclass?.foundation.features ?? []).map((f) => (
                <FeatureCard key={f.name} feature={f} />
              ))}
            </div>

            <span className={styles.sectionTitle}>Specialization</span>
            <div className={styles.featGrid}>
              {(subclass?.specialization.features ?? []).map((f) => (
                <FeatureCard key={f.name} feature={f} locked={!specUnlocked} unlockHint="Unlocks LV 5" />
              ))}
            </div>

            <span className={styles.sectionTitle}>Mastery</span>
            <div className={styles.featGrid}>
              {(subclass?.mastery.features ?? []).map((f) => (
                <FeatureCard key={f.name} feature={f} locked={!masteryUnlocked} unlockHint="Unlocks LV 8" />
              ))}
            </div>
          </div>
        </div>
      </Frame>

      {/* Heritage */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Heritage</div>
          <span className="caps" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
            {ancestry?.name} · {community?.name}
          </span>
        </div>
        <div className="card-body">
          <div className={styles.featGrid}>
            {(ancestry?.features ?? []).map((f) => (
              <FeatureCard key={`a-${f.name}`} feature={f} />
            ))}
            {(community?.features ?? []).map((f) => (
              <FeatureCard key={`c-${f.name}`} feature={f} />
            ))}
          </div>
        </div>
      </Frame>

      {/* Experiences */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Experiences</div>
          <button className="button button-primary short" type="button" onClick={openAdd}>
            <Icon name="plus" size={12} /> Add
          </button>
        </div>
        <div className="card-body">
          {experiences.length === 0 ? (
            <span className={styles.empty}>No experiences yet — most heroes start with two at +2.</span>
          ) : (
            <div className={styles.expList}>
              {experiences.map((x, i) => (
                <div key={i} className={styles.expItem}>
                  <span className={styles.expName}>{x.name}</span>
                  <div className={styles.expRight}>
                    <span className="chip chip-gold">{x.bonus >= 0 ? `+${x.bonus}` : x.bonus}</span>
                    <button className="sf-icon-btn" type="button" onClick={() => openEdit(i)} aria-label="Edit">
                      <Icon name="edit" size={13} />
                    </button>
                    <ConfirmButton className="sf-icon-btn" aria-label="Delete" title="Delete experience?" message={`Remove "${x.name || "this experience"}"? This can't be undone.`} onConfirm={() => persist(experiences.filter((_, idx) => idx !== i))}>
                      <Icon name="trash" size={13} />
                    </ConfirmButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Frame>

      <Popup closerFunc={setShowForm} toggle={showForm}>
        <form onSubmit={submit}>
          <Frame classes="column-direction">
            <h3 className="card-title">{editIndex === null ? "Add Experience" : "Edit Experience"}</h3>
            <input className="input" placeholder="Experience (e.g. Silver Tongue)" value={form.name} autoFocus onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label className="caps" style={{ fontSize: 11 }}>Bonus</label>
            <input className="input" type="number" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: parseInt(e.target.value) || 0 })} />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button type="submit" className="button button-accent stretch">{editIndex === null ? "Add" : "Save"}</button>
              <button type="button" className="button button-secondary stretch" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>
    </>
  );
}

function Features() {
  return <SheetShell active="features">{(ctx) => <FeaturesBody {...ctx} />}</SheetShell>;
}
