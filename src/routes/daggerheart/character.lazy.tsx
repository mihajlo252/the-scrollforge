import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Load } from "../../components/Load";
import { Popup } from "../../components/Popup/Popup";
import { Icon } from "../../components/Primitives";
import { Notes } from "../../sections/Notes";
import { DiceBoxComponent } from "../../sections/DiceBox";
import { SheetTabs } from "../../sections/Daggerheart/CharacterProfile/SheetTabs";
import { SheetTopbar } from "../../sections/Daggerheart/CharacterProfile/SheetTopbar";
import { LevelUpModal } from "../../sections/Daggerheart/CharacterProfile/LevelUpModal";
import { BoxTrack, HPTrack, DHTraitTile } from "../../sections/Daggerheart/CharacterProfile/Trackers";
import { TRAIT_NAMES, getClass, getSpellcastTrait, flattenDescription, defaultVitals, defaultTraits } from "../../utilities/daggerheart";
import { patchCharacter } from "../../utilities/patchCharacter";
import { sendData } from "../../utilities/sendData";
import gate from "./character.module.css";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/daggerheart/character")({
  component: Vitals,
});

const GOLD_UNITS: { key: keyof DHGold; label: string }[] = [
  { key: "handfuls", label: "Handfuls" },
  { key: "bags", label: "Bags" },
  { key: "chest", label: "Chest" },
];

const WeaponMini = ({ weapon, slot }: { weapon: DHWeapon | null | undefined; slot: string }) => (
  <div className={styles.weaponMini}>
    <div className={styles.weaponMiniHead}>
      <span className="caps" style={{ fontSize: 9 }}>{slot}</span>
      {weapon && <span className="mono" style={{ color: "var(--gold-2)", fontSize: 13 }}>{weapon.damage}</span>}
    </div>
    {weapon ? (
      <>
        <div className={styles.weaponMiniName}>{weapon.name}</div>
        <div className={styles.weaponMiniMeta}>
          <span className="chip">{weapon.trait}</span>
          <span className="chip">{weapon.range}</span>
          {weapon.burden && <span className="chip">{weapon.burden}</span>}
        </div>
      </>
    ) : (
      <span className={styles.empty}>No weapon equipped</span>
    )}
  </div>
);

function Vitals() {
  const dev = import.meta.env.VITE_DEV_MODE;

  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const character: DaggerheartCharacter | undefined = state?.character;

  const [toggleNotes, setToggleNotes] = useState(false);
  const [toggleDice, setToggleDice] = useState(false);
  const [toggleLevelUp, setToggleLevelUp] = useState(false);
  const [vitals, setVitals] = useState<DHVitals>(
    () => character?.dhVitals ?? defaultVitals(character?.characterProfile?.class, character?.characterProfile?.level ?? 1),
  );
  const [gold, setGold] = useState<DHGold>(() => character?.dhGold ?? { handfuls: 0, bags: 0, chest: 0 });

  if (dev === "false") {
    return (
      <Frame classes={gate.unavailable}>
        <h1 className="text-content text-primary">Currently unavailable. Please check back later!</h1>
      </Frame>
    );
  }

  if (!character) return <Load />;

  const profile = character.characterProfile;
  const traits = character.dhTraits ?? defaultTraits();
  const cls = getClass(profile.class);
  const spellTrait = getSpellcastTrait(profile.subclass);

  const persistVitals = (next: DHVitals) => {
    setVitals(next);
    patchCharacter(state, { dhVitals: next });
    sendData("characters", character.id, { dhVitals: next });
  };
  const persistGold = (next: DHGold) => {
    setGold(next);
    patchCharacter(state, { dhGold: next });
    sendData("characters", character.id, { dhGold: next });
  };

  const stepGold = (key: keyof DHGold, delta: number) =>
    persistGold({ ...gold, [key]: Math.max(0, (gold[key] ?? 0) + delta) });

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
      <SheetTabs active="vitals" />
      <SheetTopbar character={character} onNotes={() => setToggleNotes(true)} onRoll={() => setToggleDice(true)} onLevelUp={() => setToggleLevelUp(true)} />

      {/* Traits */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Traits</div>
          <span className="caps" style={{ fontSize: 11, color: "var(--ink-faint)" }}>✦ marks Spellcast trait</span>
        </div>
        <div className="card-body">
          <div className={styles.traitRow}>
            {TRAIT_NAMES.map((t) => (
              <DHTraitTile key={t} name={t} value={traits[t] ?? 0} spellcast={!!spellTrait && spellTrait.toUpperCase() === t.toUpperCase()} />
            ))}
          </div>
        </div>
      </Frame>

      <div className={styles.vitalsGrid}>
        {/* Vitals card */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Vitals</div>
            <span className="chip chip-gold">Proficiency {vitals.proficiency}</span>
          </div>
          <div className="card-body">
            <div className={styles.section}>
              <div className={styles.statRow}>
                <div className={styles.bigStat}>
                  <span className={styles.bigStatVal}>{vitals.evasion}</span>
                  <span className={styles.bigStatLabel}>Evasion</span>
                </div>
                <div className={styles.statRowLabel} style={{ alignItems: "flex-end" }}>
                  <span className={styles.subLabel}>Armor Score</span>
                  <span className={styles.monoVal}>{vitals.armorScore}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.statRow}>
                <div className={styles.statRowLabel}>
                  <span className={styles.subLabel}>Armor Slots</span>
                  <span className={styles.subHint}>{vitals.armorSlots.marked}/{vitals.armorSlots.total} marked</span>
                </div>
                <BoxTrack
                  total={vitals.armorSlots.total}
                  marked={vitals.armorSlots.marked}
                  color="var(--arcane)"
                  onChange={(m) => persistVitals({ ...vitals, armorSlots: { ...vitals.armorSlots, marked: m } })}
                />
              </div>

              <div className={styles.divider} />

              <div className={styles.statRowLabel}>
                <span className={styles.subLabel}>Hit Points · {vitals.hp.marked}/{vitals.hp.total} marked</span>
                <HPTrack hp={vitals.hp} onChange={(m) => persistVitals({ ...vitals, hp: { ...vitals.hp, marked: m } })} />
              </div>

              <div className={styles.divider} />

              <div className={styles.statRow}>
                <div className={styles.statRowLabel}>
                  <span className={styles.subLabel}>Stress</span>
                  <span className={styles.subHint}>{vitals.stress.marked}/{vitals.stress.total} marked</span>
                </div>
                <BoxTrack
                  total={vitals.stress.total}
                  marked={vitals.stress.marked}
                  color="var(--ember)"
                  onChange={(m) => persistVitals({ ...vitals, stress: { ...vitals.stress, marked: m } })}
                />
              </div>
            </div>
          </div>
        </Frame>

        {/* Hope card */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Hope</div>
            <span className="mono" style={{ color: "var(--gold-2)" }}>{vitals.hope.total - vitals.hope.marked}/{vitals.hope.total}</span>
          </div>
          <div className="card-body">
            <div className={styles.section}>
              <BoxTrack
                total={vitals.hope.total}
                marked={vitals.hope.marked}
                shape="circle"
                color="var(--gold)"
                onChange={(m) => persistVitals({ ...vitals, hope: { ...vitals.hope, marked: m } })}
              />
              {cls?.hopeFeature && (
                <div className={styles.featureBox}>
                  <div className={styles.featureName}>{cls.hopeFeature.name}</div>
                  <div className={styles.featureText}>{flattenDescription(cls.hopeFeature.description)}</div>
                </div>
              )}
            </div>
          </div>
        </Frame>
      </div>

      <div className={styles.lowerGrid}>
        {/* Active weapons */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Active Weapons</div>
          </div>
          <div className="card-body">
            <div className={styles.weaponStrip}>
              <WeaponMini weapon={character.dhWeapons?.primary} slot="Primary" />
              <WeaponMini weapon={character.dhWeapons?.secondary} slot="Secondary" />
            </div>
          </div>
        </Frame>

        {/* Gold */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Gold</div>
          </div>
          <div className="card-body">
            <div className={styles.goldRow}>
              {GOLD_UNITS.map(({ key, label }) => (
                <div key={key} className={styles.goldUnit}>
                  <span className={styles.goldVal}>{gold[key] ?? 0}</span>
                  <div className={styles.goldStepper}>
                    <button type="button" className="sf-icon-btn" onClick={() => stepGold(key, -1)} aria-label={`Decrease ${label}`}>
                      <Icon name="back" size={13} />
                    </button>
                    <button type="button" className="sf-icon-btn" onClick={() => stepGold(key, 1)} aria-label={`Increase ${label}`}>
                      <Icon name="plus" size={13} />
                    </button>
                  </div>
                  <span className={styles.goldLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Frame>
      </div>

      <LevelUpModal character={character} state={state} toggle={toggleLevelUp} onClose={() => setToggleLevelUp(false)} />

      <Popup closerFunc={setToggleNotes} toggle={toggleNotes}>
        <Notes />
      </Popup>
      <Popup closerFunc={setToggleDice} toggle={toggleDice}>
        <Frame classes="column-direction">
          <DiceBoxComponent />
        </Frame>
      </Popup>
    </motion.section>
  );
}
