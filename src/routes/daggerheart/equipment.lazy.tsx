import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { SheetShell } from "../../sections/Daggerheart/CharacterProfile/SheetShell";
import { TRAIT_NAMES, primaryWeapons, secondaryWeapons, allArmors, weaponById, armorById, weaponToDH, armorToDH, formatWeaponDamage, tierForLevel, parseGearFeature, formatGearMods } from "../../utilities/daggerheart";
import { patchCharacter } from "../../utilities/patchCharacter";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/daggerheart/equipment")({
  component: Equipment,
});

const GOLD_UNITS: { key: keyof DHGold; label: string }[] = [
  { key: "handfuls", label: "Handfuls" },
  { key: "bags", label: "Bags" },
  { key: "chest", label: "Chest" },
];

/** Module-level (NOT inline in EquipmentBody): an inline component gets a new
 *  identity every render, so React would remount the card — a visible flicker
 *  on each keystroke while an edit popup is open. */
const WeaponCard = ({ w, label, onEdit }: { w: DHWeapon | null; label: string; onEdit: () => void }) => {
  const modsLine = w ? formatGearMods(parseGearFeature(w.feature)) : "";
  return (
    <div className={styles.weaponMini}>
      <div className={styles.weaponMiniHead}>
        <span className="caps" style={{ fontSize: 9 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {w && <span className="mono" style={{ color: "var(--gold-2)", fontSize: 13 }}>{w.damage}</span>}
          <button className="sf-icon-btn" type="button" onClick={onEdit} aria-label={`Edit ${label}`}>
            <Icon name="edit" size={12} />
          </button>
        </div>
      </div>
      {w ? (
        <>
          <div className={styles.weaponMiniName}>{w.name}</div>
          <div className={styles.weaponMiniMeta}>
            <span className="chip">{w.trait}</span>
            <span className="chip">{w.range}</span>
            <span className="chip">{w.dtype}</span>
            {w.burden && <span className="chip">{w.burden}</span>}
          </div>
          {w.feature && <div className={styles.featureText}>{w.feature}</div>}
          {modsLine && <span className={styles.subHint}>Applies to your sheet: {modsLine}</span>}
        </>
      ) : (
        <span className={styles.empty}>No weapon equipped</span>
      )}
    </div>
  );
};

const emptyWeapon = (): DHWeapon => ({ name: "", trait: "Agility", range: "Melee", damage: "", dtype: "phy", burden: "One-Handed", feature: "" });
const emptyArmor = (): DHArmor => ({ name: "", score: 0, thresholds: { major: 0, severe: 0 }, feature: "" });
const emptyItem = (): DHInventoryItem => ({ name: "", qty: 1, note: "" });

function EquipmentBody({ character, state }: { character: DaggerheartCharacter; state: any }) {
  const level = character.characterProfile.level || 1;
  // Catalog picks are capped at the character's tier, like at creation.
  const gearTier = tierForLevel(level);
  const [weapons, setWeapons] = useState<DHWeapons>(character.dhWeapons ?? { primary: null, secondary: null });
  const [armor, setArmor] = useState<DHArmor | null>(character.dhArmor ?? null);
  const [inventory, setInventory] = useState<DHInventoryItem[]>(character.dhInventory ?? []);
  const [gold, setGold] = useState<DHGold>(character.dhGold ?? { handfuls: 0, bags: 0, chest: 0 });

  // Edit modals
  const [weaponSlot, setWeaponSlot] = useState<keyof DHWeapons | null>(null);
  const [weaponForm, setWeaponForm] = useState<DHWeapon>(emptyWeapon());
  const [armorOpen, setArmorOpen] = useState(false);
  const [armorForm, setArmorForm] = useState<DHArmor>(emptyArmor());
  const [itemOpen, setItemOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState<DHInventoryItem>(emptyItem());

  const armorModsLine = armor ? formatGearMods(parseGearFeature(armor.feature)) : "";

  const persist = (patch: Partial<DaggerheartCharacter>) => {
    patchCharacter(state, patch);
    sendData("characters", character.id, patch as Record<string, any>);
  };

  const persistWeapons = (next: DHWeapons) => { setWeapons(next); persist({ dhWeapons: next }); };
  const persistInventory = (next: DHInventoryItem[]) => { setInventory(next); persist({ dhInventory: next }); };
  const persistGold = (next: DHGold) => { setGold(next); persist({ dhGold: next }); };
  const stepGold = (key: keyof DHGold, delta: number) => persistGold({ ...gold, [key]: Math.max(0, (gold[key] ?? 0) + delta) });

  // Equipping armor also updates the derived vitals (Armor Score, slots, thresholds).
  const persistArmor = (next: DHArmor | null) => {
    setArmor(next);
    const vitals = character.dhVitals;
    if (vitals) {
      const score = next?.score ?? 0;
      const updatedVitals: DHVitals = {
        ...vitals,
        armorScore: score,
        armorSlots: { total: score, marked: Math.min(vitals.armorSlots.marked, score) },
        hp: {
          ...vitals.hp,
          major: (next?.thresholds.major ?? 0) + level,
          severe: (next?.thresholds.severe ?? 0) + level,
        },
      };
      persist({ dhArmor: next, dhVitals: updatedVitals });
    } else {
      persist({ dhArmor: next });
    }
  };

  const openWeapon = (slot: keyof DHWeapons) => {
    setWeaponSlot(slot);
    setWeaponForm(weapons[slot] ?? emptyWeapon());
  };
  const saveWeapon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weaponSlot) return;
    persistWeapons({ ...weapons, [weaponSlot]: weaponForm.name.trim() ? weaponForm : null });
    setWeaponSlot(null);
  };

  const openArmor = () => { setArmorForm(armor ?? emptyArmor()); setArmorOpen(true); };
  const saveArmor = (e: React.FormEvent) => {
    e.preventDefault();
    persistArmor(armorForm.name.trim() ? armorForm : null);
    setArmorOpen(false);
  };

  const openItemAdd = () => { setItemForm(emptyItem()); setItemIndex(null); setItemOpen(true); };
  const openItemEdit = (i: number) => { setItemForm({ ...inventory[i] }); setItemIndex(i); setItemOpen(true); };
  const saveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim()) return;
    const next = itemIndex === null ? [...inventory, itemForm] : inventory.map((x, i) => (i === itemIndex ? itemForm : x));
    persistInventory(next);
    setItemOpen(false);
  };

  return (
    <>
      {/* Weapons */}
      <Frame classes="card">
        <div className="card-hdr"><div className="card-title">Weapons</div></div>
        <div className="card-body">
          <div className={styles.weaponStrip}>
            <WeaponCard w={weapons.primary} label="Primary" onEdit={() => openWeapon("primary")} />
            <WeaponCard w={weapons.secondary} label="Secondary" onEdit={() => openWeapon("secondary")} />
          </div>
        </div>
      </Frame>

      <div className={styles.lowerGrid}>
        {/* Armor */}
        <Frame classes="card">
          <div className="card-hdr">
            <div className="card-title">Active Armor</div>
            <button className="button button-primary short" type="button" onClick={openArmor}>
              <Icon name={armor ? "edit" : "plus"} size={12} /> {armor ? "Edit" : "Equip"}
            </button>
          </div>
          <div className="card-body">
            {armor ? (
              <div className={styles.section}>
                <div className={styles.weaponMiniName}>{armor.name}</div>
                <div className={styles.statRow}>
                  <div className={styles.statRowLabel}><span className={styles.subLabel}>Armor Score</span><span className={styles.monoVal}>{armor.score}</span></div>
                  <div className={styles.statRowLabel}><span className={styles.subLabel}>Major</span><span className={styles.monoVal}>{armor.thresholds.major}</span></div>
                  <div className={styles.statRowLabel}><span className={styles.subLabel}>Severe</span><span className={styles.monoVal}>{armor.thresholds.severe}</span></div>
                </div>
                {armor.feature && <div className={styles.featureText}>{armor.feature}</div>}
                {armorModsLine && <span className={styles.subHint}>Applies to your sheet: {armorModsLine}</span>}
              </div>
            ) : (
              <span className={styles.empty}>No armor equipped</span>
            )}
          </div>
        </Frame>

        {/* Gold */}
        <Frame classes="card">
          <div className="card-hdr"><div className="card-title">Gold</div></div>
          <div className="card-body">
            <div className={styles.goldRow}>
              {GOLD_UNITS.map(({ key, label }) => (
                <div key={key} className={styles.goldUnit}>
                  <span className={styles.goldVal}>{gold[key] ?? 0}</span>
                  <div className={styles.goldStepper}>
                    <button type="button" className="sf-icon-btn" onClick={() => stepGold(key, -1)} aria-label={`Decrease ${label}`}><Icon name="back" size={13} /></button>
                    <button type="button" className="sf-icon-btn" onClick={() => stepGold(key, 1)} aria-label={`Increase ${label}`}><Icon name="plus" size={13} /></button>
                  </div>
                  <span className={styles.goldLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Frame>
      </div>

      {/* Inventory */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Inventory</div>
          <button className="button button-primary short" type="button" onClick={openItemAdd}>
            <Icon name="plus" size={12} /> Add Item
          </button>
        </div>
        <div className="card-body">
          {inventory.length === 0 ? (
            <span className={styles.empty}>Nothing in your pack yet.</span>
          ) : (
            <div className={styles.invList}>
              {inventory.map((it, i) => (
                <div key={i} className={styles.invItem}>
                  <div className={styles.invMain}>
                    <span className={styles.invName}>{it.name}</span>
                    {it.note && <span className={styles.invNote}>{it.note}</span>}
                  </div>
                  <div className={styles.invRight}>
                    <span className="mono" style={{ color: "var(--ink-dim)" }}>×{it.qty}</span>
                    <button className="sf-icon-btn" type="button" onClick={() => openItemEdit(i)} aria-label="Edit"><Icon name="edit" size={13} /></button>
                    <ConfirmButton className="sf-icon-btn" aria-label="Delete" title="Delete item?" message={`Remove "${it.name}" from your inventory? This can't be undone.`} onConfirm={() => persistInventory(inventory.filter((_, idx) => idx !== i))}><Icon name="trash" size={13} /></ConfirmButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Frame>

      {/* Weapon form */}
      <Popup closerFunc={() => setWeaponSlot(null)} toggle={weaponSlot !== null}>
        <form onSubmit={saveWeapon}>
          <Frame classes="column-direction">
            <h3 className="card-title">{weaponSlot === "primary" ? "Primary" : "Secondary"} Weapon</h3>
            <select className="select" value="" onChange={(e) => { const w = weaponById(e.target.value); if (w) setWeaponForm(weaponToDH(w)); }}>
              <option value="">Choose from catalog (Tier {gearTier} or lower)…</option>
              {(weaponSlot === "secondary" ? secondaryWeapons() : primaryWeapons())
                .filter((w) => w.tier <= gearTier)
                .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
                .map((w) => (
                  <option key={w.id} value={w.id}>{w.name} · T{w.tier} · {formatWeaponDamage(w)}</option>
                ))}
            </select>
            <input className="input" placeholder="Weapon name" value={weaponForm.name} autoFocus onChange={(e) => setWeaponForm({ ...weaponForm, name: e.target.value })} />
            <div className={styles.formGrid}>
              <select className="select" value={weaponForm.trait} onChange={(e) => setWeaponForm({ ...weaponForm, trait: e.target.value })}>
                {TRAIT_NAMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="input" placeholder="Range (Melee, Far…)" value={weaponForm.range} onChange={(e) => setWeaponForm({ ...weaponForm, range: e.target.value })} />
              <input className="input" placeholder="Damage (1d8+1)" value={weaponForm.damage} onChange={(e) => setWeaponForm({ ...weaponForm, damage: e.target.value })} />
              <select className="select" value={weaponForm.dtype} onChange={(e) => setWeaponForm({ ...weaponForm, dtype: e.target.value })}>
                <option value="phy">Physical</option>
                <option value="mag">Magic</option>
              </select>
              <select className="select" value={weaponForm.burden} onChange={(e) => setWeaponForm({ ...weaponForm, burden: e.target.value })}>
                <option>One-Handed</option>
                <option>Two-Handed</option>
              </select>
            </div>
            <textarea className="textarea" rows={2} placeholder="Feature (optional)" value={weaponForm.feature} onChange={(e) => setWeaponForm({ ...weaponForm, feature: e.target.value })} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="button button-accent stretch">Save</button>
              <button type="button" className="button button-secondary stretch" onClick={() => { persistWeapons({ ...weapons, [weaponSlot!]: null }); setWeaponSlot(null); }}>Clear</button>
            </div>
          </Frame>
        </form>
      </Popup>

      {/* Armor form */}
      <Popup closerFunc={setArmorOpen} toggle={armorOpen}>
        <form onSubmit={saveArmor}>
          <Frame classes="column-direction">
            <h3 className="card-title">Active Armor</h3>
            <select className="select" value="" onChange={(e) => { const a = armorById(e.target.value); if (a) setArmorForm(armorToDH(a)); }}>
              <option value="">Choose from catalog (Tier {gearTier} or lower)…</option>
              {allArmors()
                .filter((a) => a.tier <= gearTier)
                .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
                .map((a) => (
                  <option key={a.id} value={a.id}>{a.name} · T{a.tier} · Score {a.baseScore} · {a.baseMajorThreshold}/{a.baseSevereThreshold}</option>
                ))}
            </select>
            <input className="input" placeholder="Armor name" value={armorForm.name} autoFocus onChange={(e) => setArmorForm({ ...armorForm, name: e.target.value })} />
            <div className={styles.formGrid}>
              <input className="input" type="number" placeholder="Armor Score" value={armorForm.score} onChange={(e) => setArmorForm({ ...armorForm, score: parseInt(e.target.value) || 0 })} />
              <span />
              <input className="input" type="number" placeholder="Major threshold" value={armorForm.thresholds.major} onChange={(e) => setArmorForm({ ...armorForm, thresholds: { ...armorForm.thresholds, major: parseInt(e.target.value) || 0 } })} />
              <input className="input" type="number" placeholder="Severe threshold" value={armorForm.thresholds.severe} onChange={(e) => setArmorForm({ ...armorForm, thresholds: { ...armorForm.thresholds, severe: parseInt(e.target.value) || 0 } })} />
            </div>
            <span className={styles.subHint}>Thresholds shown on the sheet add your level (+{level}).</span>
            <textarea className="textarea" rows={2} placeholder="Feature (optional)" value={armorForm.feature} onChange={(e) => setArmorForm({ ...armorForm, feature: e.target.value })} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="button button-accent stretch">Save</button>
              <button type="button" className="button button-secondary stretch" onClick={() => { persistArmor(null); setArmorOpen(false); }}>Unequip</button>
            </div>
          </Frame>
        </form>
      </Popup>

      {/* Item form */}
      <Popup closerFunc={setItemOpen} toggle={itemOpen}>
        <form onSubmit={saveItem}>
          <Frame classes="column-direction">
            <h3 className="card-title">{itemIndex === null ? "Add Item" : "Edit Item"}</h3>
            <input className="input" placeholder="Item name" value={itemForm.name} autoFocus onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
            <div className={styles.formGrid}>
              <input className="input" type="number" min={1} placeholder="Qty" value={itemForm.qty} onChange={(e) => setItemForm({ ...itemForm, qty: parseInt(e.target.value) || 1 })} />
              <span />
            </div>
            <textarea className="textarea" rows={2} placeholder="Note (optional)" value={itemForm.note} onChange={(e) => setItemForm({ ...itemForm, note: e.target.value })} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="button button-accent stretch">{itemIndex === null ? "Add" : "Save"}</button>
              <button type="button" className="button button-secondary stretch" onClick={() => setItemOpen(false)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>
    </>
  );
}

function Equipment() {
  return <SheetShell active="equipment">{(ctx) => <EquipmentBody {...ctx} />}</SheetShell>;
}
