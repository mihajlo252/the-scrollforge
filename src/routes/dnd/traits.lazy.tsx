import { createLazyFileRoute } from "@tanstack/react-router";
import { motion, Reorder } from "framer-motion";
import { useRef, useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Heading, Icon } from "../../components/Primitives";
import { ConfirmButton } from "../../components/ConfirmButton";
import { ReorderRow } from "../../components/Reorderable";
import { SheetTabs } from "../../sections/DnD/CharacterProfile/SheetTabs";
import { mergeReorder, stableKey } from "../../utilities/reorder";
import { sendData } from "../../utilities/sendData";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/dnd/traits")({
  component: TraitsScreen,
});

const emptyTrait = (): TraitItem => ({ name: "", category: "Features & Traits", sub: "", chips: [], text: "" });

function TraitsScreen() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const character: Character = state.character;

  const [traits, setTraits] = useState<TraitItem[]>(character.traits || []);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<TraitItem>(emptyTrait());

  const categories = Array.from(new Set(traits.map((t) => t.category).filter(Boolean)));

  const persist = async (next: TraitItem[]) => {
    setTraits(next);
    localStorage.setItem("character", JSON.stringify({ state: { ...state, character: { ...character, traits: next } }, version: 1 }));
    await sendData("characters", character.id, { traits: next });
  };

  const matches = (t: TraitItem) =>
    (activeCat === "all" || t.category === activeCat) &&
    (!query || t.name.toLowerCase().includes(query.toLowerCase()) || (t.text ?? "").toLowerCase().includes(query.toLowerCase()));
  const filtered = traits.map((t, i) => ({ t, i })).filter(({ t }) => matches(t));

  const pending = useRef<TraitItem[] | null>(null);
  // During drag: update React state only (keeps it smooth). Persist on drop.
  const reorder = (visibleNewOrder: TraitItem[]) => {
    const next = mergeReorder(traits, visibleNewOrder, matches);
    setTraits(next);
    pending.current = next;
  };
  const commitReorder = async () => {
    if (!pending.current) return;
    const next = pending.current;
    pending.current = null;
    localStorage.setItem("character", JSON.stringify({ state: { ...state, character: { ...character, traits: next } }, version: 1 }));
    await sendData("characters", character.id, { traits: next });
  };

  const openAdd = () => {
    setForm(emptyTrait());
    setEditIndex(null);
    setShowForm(true);
  };
  const openEdit = (i: number) => {
    setForm({ ...emptyTrait(), ...traits[i] });
    setEditIndex(i);
    setShowForm(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = editIndex === null ? [...traits, form] : traits.map((t, i) => (i === editIndex ? form : t));
    await persist(next);
    setShowForm(false);
  };

  const deleteTrait = async (i: number) => {
    await persist(traits.filter((_, idx) => idx !== i));
  };

  const setField = (name: keyof TraitItem, value: any) => setForm((p) => ({ ...p, [name]: value }));

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
      <SheetTabs active="traits" />

      <div className={styles.traitsGrid}>
        {/* Sidebar */}
        <Frame classes={`card ${styles.sidebar}`}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}><Icon name="search" size={14} /></span>
            <input className={`input ${styles.searchInput}`} placeholder="Search traits…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="caps" style={{ marginBottom: 10 }}>Categories</div>
          <div className={styles.catList}>
            <button className={styles.catBtn} data-active={activeCat === "all" ? "" : undefined} onClick={() => setActiveCat("all")}>
              <span>All traits</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{traits.length}</span>
            </button>
            {categories.map((cat) => (
              <button key={cat} className={styles.catBtn} data-active={activeCat === cat ? "" : undefined} onClick={() => setActiveCat(cat)}>
                <span>{cat}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{traits.filter((t) => t.category === cat).length}</span>
              </button>
            ))}
          </div>
        </Frame>

        {/* Content */}
        <div className={styles.contentCol}>
          <div className={styles.contentHead}>
            <Heading size={26} align="left">{activeCat === "all" ? "All Traits" : activeCat}</Heading>
            <button className="button button-primary short" onClick={openAdd} type="button">
              <Icon name="plus" size={12} /> Add Trait
            </button>
          </div>
          {filtered.length === 0 && <p className="text-content" style={{ color: "var(--ink-dim)" }}>No traits to show.</p>}
          <Reorder.Group axis="y" values={filtered.map((f) => f.t)} onReorder={reorder} as="div" className={styles.reorderCardGroup}>
            {filtered.map(({ t, i }) => (
              <ReorderRow key={stableKey(t)} value={t} className={styles.reorderCard} handleClassName={styles.dragHandle} onCommit={commitReorder}>
                <TraitCard t={t} onEdit={() => openEdit(i)} onDelete={() => deleteTrait(i)} />
              </ReorderRow>
            ))}
          </Reorder.Group>
        </div>
      </div>

      <Popup closerFunc={setShowForm} toggle={showForm}>
        <form onSubmit={submitForm} className={styles.addForm}>
          <Frame classes={styles.addFrame}>
            <h3 className="card-title">{editIndex === null ? "Add Trait" : "Edit Trait"}</h3>
            <input className="input" placeholder="Trait Name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            <div className={styles.formRow}>
              <select className="select" value={form.category} onChange={(e) => setField("category", e.target.value)} required>
                <option value="Features & Traits">Features &amp; Traits</option>
                <option value="Racial Traits">Racial Traits</option>
              </select>
              <input className="input" placeholder="Subtitle (optional)" value={form.sub ?? ""} onChange={(e) => setField("sub", e.target.value)} />
            </div>
            <input
              className="input"
              placeholder="Chips, comma separated (e.g. Damage: 4d6, Reaction)"
              value={(form.chips ?? []).join(", ")}
              onChange={(e) => setField("chips", e.target.value.split(",").map((c) => c.trim()).filter(Boolean))}
            />
            <textarea className="textarea" placeholder="Description" rows={5} value={form.text} onChange={(e) => setField("text", e.target.value)} />
            <div className={styles.formRow}>
              <button type="submit" className="button button-accent stretch">{editIndex === null ? "Add" : "Save"}</button>
              <button type="button" className="button button-secondary stretch" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </Frame>
        </form>
      </Popup>
    </motion.section>
  );
}

const TraitCard = ({ t, onEdit, onDelete }: { t: TraitItem; onEdit: () => void; onDelete: () => void }) => {
  const [open, setOpen] = useState(false);
  const isRacial = (t.category ?? "").toLowerCase().includes("racial") || (t.category ?? "").toLowerCase().includes("ancestry");
  return (
    <Frame classes={`card ${styles.traitCard}`}>
      <div className={styles.traitCardHead} onClick={() => setOpen(!open)}>
        <div className={styles.traitIcon}><Icon name={isRacial ? "user" : "book"} size={16} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.traitTitleRow}>
            <div className={styles.traitName}>{t.name}</div>
            {t.sub && <div className={styles.traitSub}>— {t.sub}</div>}
            {(t.chips ?? []).map((c) => (
              <span key={c} className={`chip ${c.toLowerCase().includes("drawback") ? "chip-ember" : "chip-gold"}`} style={{ fontSize: 11 }}>{c}</span>
            ))}
          </div>
          <div className="caps" style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 3 }}>{t.category}</div>
        </div>
        <span className={`sf-icon-btn ${styles.traitChevron}`} style={{ width: 32, height: 32, transform: open ? "rotate(180deg)" : "none" }}>
          <Icon name="chev_d" size={12} />
        </span>
      </div>
      {open && (
        <>
          <div className={styles.traitBody}>{t.text}</div>
          <div className={styles.traitCardActions}>
            <button className="button button-ghost short" onClick={onEdit} type="button"><Icon name="edit" size={12} /> Edit</button>
            <ConfirmButton className="button button-secondary short" title="Delete trait?" message="Remove this trait? This can't be undone." onConfirm={onDelete}><Icon name="trash" size={12} /></ConfirmButton>
          </div>
        </>
      )}
    </Frame>
  );
};
