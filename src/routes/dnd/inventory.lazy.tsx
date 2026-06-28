import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { HPBar, Icon } from "../../components/Primitives";
import { SheetTabs } from "../../sections/DnD/CharacterProfile/SheetTabs";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/dnd/inventory")({
  component: InventoryScreen,
});

const COINS: [keyof Currency, string][] = [
  ["pp", "#d9d9e8"],
  ["gp", "#c9a24a"],
  ["ep", "#a8c0b8"],
  ["sp", "#b8bfc7"],
  ["cp", "#a37046"],
];

const RARITY: Record<string, string> = {
  common: "var(--ink-dim)",
  uncommon: "var(--emerald)",
  rare: "var(--arcane)",
  veryrare: "var(--ember-2)",
  legendary: "var(--gold-2)",
};
const RARITIES = ["common", "uncommon", "rare", "veryrare", "legendary"];

const emptyItem = (): InventoryItem => ({ name: "", type: "", qty: 1, wt: 0, rarity: "common", equipped: false, dmg: "", note: "" });
const emptyCurrency = (): Currency => ({ pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 });

function InventoryScreen() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const character: Character = state.character;

  const [items, setItems] = useState<InventoryItem[]>(character.inventory || []);
  const [currency, setCurrency] = useState<Currency>(character.currency ?? emptyCurrency());
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<InventoryItem>(emptyItem());

  const str = character.stats.primaryStats.str ?? 10;
  const capacity = str * 15;
  const weight = items.reduce((a, i) => a + (i.wt || 0) * (i.qty || 0), 0);

  const persistItems = async (next: InventoryItem[]) => {
    setItems(next);
    localStorage.setItem("character", JSON.stringify({ state: { ...state, character: { ...character, inventory: next } }, version: 1 }));
    await sendData("characters", character.id, { inventory: next });
  };
  const persistCurrency = async (next: Currency) => {
    setCurrency(next);
    localStorage.setItem("character", JSON.stringify({ state: { ...state, character: { ...character, currency: next } }, version: 1 }));
    await sendData("characters", character.id, { currency: next });
  };

  const filtered = items.map((i, idx) => ({ i, idx })).filter(({ i }) => !q || i.name.toLowerCase().includes(q.toLowerCase()));
  const equipped = items.map((i, idx) => ({ i, idx })).filter(({ i }) => i.equipped);

  const openAdd = () => {
    setForm(emptyItem());
    setEditIndex(null);
    setShowForm(true);
  };
  const openEdit = (idx: number) => {
    setForm({ ...emptyItem(), ...items[idx] });
    setEditIndex(idx);
    setShowForm(true);
  };
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = editIndex === null ? [...items, form] : items.map((it, i) => (i === editIndex ? form : it));
    await persistItems(next);
    setShowForm(false);
  };
  const deleteItem = async (idx: number) => persistItems(items.filter((_, i) => i !== idx));
  const setField = (name: keyof InventoryItem, value: any) => setForm((p) => ({ ...p, [name]: value }));

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
      <SheetTabs active="inventory" />

      <div className={styles.invGrid}>
        {/* Left column */}
        <div className={styles.invLeft}>
          <Frame classes="card">
            <div className="card-hdr"><div className="card-title">Coin Purse</div></div>
            <div className={styles.coinGrid}>
              {COINS.map(([key, color]) => (
                <div key={key} className={styles.coin}>
                  <div className={styles.coinDot} style={{ background: color }} />
                  <input
                    type="number"
                    className={styles.coinInput}
                    value={currency[key] ?? 0}
                    onChange={(e) => persistCurrency({ ...currency, [key]: parseInt(e.target.value) || 0 })}
                  />
                  <div className="caps" style={{ fontSize: 9 }}>{key.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </Frame>

          <Frame classes="card">
            <div className="card-hdr">
              <div className="card-title">Encumbrance</div>
              <span className="mono" style={{ fontSize: 12, color: "var(--ink-dim)" }}>{weight.toFixed(1)} / {capacity} lb</span>
            </div>
            <div className={styles.encBody}>
              <HPBar cur={weight} max={capacity} temp={0} />
              <div className={styles.encNote}>{weight > capacity ? "Over capacity — encumbered" : "Within carrying capacity"}</div>
            </div>
          </Frame>

          <Frame classes="card">
            <div className="card-hdr"><div className="card-title">Equipped</div></div>
            <div className={styles.equippedList}>
              {equipped.length === 0 && <span style={{ color: "var(--ink-faint)", fontStyle: "italic", fontSize: 13 }}>Nothing equipped</span>}
              {equipped.map(({ i }) => (
                <div key={i.name} className={styles.equippedRow}>
                  <span className={styles.rarityDot} style={{ background: RARITY[i.rarity] ?? "var(--ink-dim)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.equippedName}>{i.name}</div>
                    {(i.dmg || i.note) && <div className={styles.equippedSub}>{i.dmg || i.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Frame>
        </div>

        {/* Item table */}
        <Frame classes={`card ${styles.alignList}`}>
          <div className={styles.invToolbar}>
            <div style={{ position: "relative", flex: 1 }}>
              <span className={styles.searchIcon}><Icon name="search" size={14} /></span>
              <input className={`input ${styles.searchInput}`} placeholder="Search inventory…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <button className="button button-primary short" onClick={openAdd} type="button"><Icon name="plus" size={12} /> Add Item</button>
          </div>
          <div className={styles.invHeadRow}>
            <span>Item</span>
            <span>Type</span>
            <span className={styles.right}>Qty</span>
            <span className={styles.right}>Weight</span>
            <span />
          </div>
          {filtered.length === 0 && <div style={{ padding: "1.5rem", color: "var(--ink-dim)" }}>No items.</div>}
          {filtered.map(({ i, idx }) => (
            <div key={idx} className={styles.invRow}>
              <div className={styles.invItemMain}>
                <span className={styles.rarityDot} style={{ background: RARITY[i.rarity] ?? "var(--ink-dim)" }} />
                <div style={{ minWidth: 0 }}>
                  <div className={styles.invItemName}>
                    {i.name}
                    {i.equipped && <span className={styles.equippedTag}>EQUIPPED</span>}
                  </div>
                  {(i.dmg || i.note) && <div className={styles.invItemSub}>{i.dmg || i.note}</div>}
                </div>
              </div>
              <span style={{ color: "var(--ink-dim)", fontSize: 13 }}>{i.type}</span>
              <span className={`mono ${styles.right}`} style={{ color: "var(--gold-2)" }}>×{i.qty}</span>
              <span className={`mono ${styles.right}`} style={{ color: "var(--ink-dim)" }}>{i.wt}lb</span>
              <button className="sf-icon-btn" style={{ width: 28, height: 28 }} onClick={() => openEdit(idx)} type="button" aria-label="Edit item">
                <Icon name="edit" size={12} />
              </button>
            </div>
          ))}
        </Frame>
      </div>

      <Popup closerFunc={setShowForm} toggle={showForm}>
        <form onSubmit={submitForm} className={styles.addForm}>
          <Frame classes={styles.addFrame}>
            <h3 className="card-title">{editIndex === null ? "Add Item" : "Edit Item"}</h3>
            <input className="input" placeholder="Item Name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            <div className={styles.formRow}>
              <input className="input" placeholder="Type (Weapon, Armor…)" value={form.type} onChange={(e) => setField("type", e.target.value)} />
              <select className="select" value={form.rarity} onChange={(e) => setField("rarity", e.target.value)}>
                {RARITIES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <input type="number" className="input" placeholder="Qty" min={0} value={form.qty} onChange={(e) => setField("qty", parseInt(e.target.value) || 0)} />
              <input type="number" className="input" placeholder="Weight (lb)" min={0} step="0.1" value={form.wt} onChange={(e) => setField("wt", parseFloat(e.target.value) || 0)} />
            </div>
            <input className="input" placeholder="Damage (optional)" value={form.dmg ?? ""} onChange={(e) => setField("dmg", e.target.value)} />
            <input className="input" placeholder="Note (optional)" value={form.note ?? ""} onChange={(e) => setField("note", e.target.value)} />
            <label className={styles.checkRow}>
              <input type="checkbox" checked={!!form.equipped} onChange={(e) => setField("equipped", e.target.checked)} /> Equipped
            </label>
            <div className={styles.formRow}>
              <button type="submit" className="button button-accent stretch">{editIndex === null ? "Add" : "Save"}</button>
              {editIndex !== null && (
                <button type="button" className="button button-secondary stretch" onClick={() => { deleteItem(editIndex); setShowForm(false); }}>Delete</button>
              )}
              <button type="button" className="button button-secondary stretch" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>
    </motion.section>
  );
}
