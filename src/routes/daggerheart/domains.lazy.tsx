import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { Icon } from "../../components/Primitives";
import { SheetShell } from "../../sections/Daggerheart/CharacterProfile/SheetShell";
import { DomainCardView } from "../../sections/Daggerheart/CharacterProfile/DomainCard";
import { getDomains } from "../../utilities/daggerheart";
import { patchCharacter } from "../../utilities/patchCharacter";
import { sendData } from "../../utilities/sendData";
import { toast } from "../../utilities/toasterSonner";
import domainCardsData from "../../daggerheart-config/domain-cards.json";
import styles from "./sheetScreens.module.css";

export const Route = createLazyFileRoute("/daggerheart/domains")({
  component: Domains,
});

const LOADOUT_CAP = 5;
const CATALOG = domainCardsData as DomainCard[];
const emptyCard = (domain: string): DomainCard => ({ name: "", domain, level: 1, type: "Ability", recall: 0, text: "" });

function DomainsBody({ character, state }: { character: DaggerheartCharacter; state: any }) {
  const classDomains = getDomains(character.characterProfile.class);
  const [cards, setCards] = useState<DHDomainCards>(character.dhDomainCards ?? { loadout: [], vault: [] });
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<DomainCard>(emptyCard(classDomains[0] ?? "ARCANA"));

  const persist = (next: DHDomainCards) => {
    setCards(next);
    patchCharacter(state, { dhDomainCards: next });
    sendData("characters", character.id, { dhDomainCards: next });
  };

  const loadoutFull = cards.loadout.length >= LOADOUT_CAP;

  const matchFilter = (c: DomainCard) => filter === "all" || c.domain.toUpperCase() === filter;
  const loadout = cards.loadout.filter(matchFilter);
  const vault = cards.vault.filter(matchFilter);

  const toVault = (card: DomainCard) =>
    persist({ loadout: cards.loadout.filter((c) => c !== card), vault: [...cards.vault, card] });

  const toLoadout = (card: DomainCard) => {
    if (loadoutFull) {
      toast({ style: "frame button-primary", message: `Loadout is full (max ${LOADOUT_CAP}). Move a card to the vault first.` });
      return;
    }
    persist({ vault: cards.vault.filter((c) => c !== card), loadout: [...cards.loadout, card] });
  };

  const remove = (card: DomainCard, from: "loadout" | "vault") =>
    persist({ ...cards, [from]: cards[from].filter((c) => c !== card) });

  const ownedNames = useMemo(
    () => new Set([...cards.loadout, ...cards.vault].map((c) => c.name.toLowerCase())),
    [cards],
  );
  const browseable = CATALOG.filter(
    (c) => classDomains.some((d) => d.toUpperCase() === c.domain.toUpperCase()) && !ownedNames.has(c.name.toLowerCase()),
  );

  const addCard = (card: DomainCard) => {
    const toLoad = !loadoutFull;
    persist(toLoad ? { ...cards, loadout: [...cards.loadout, card] } : { ...cards, vault: [...cards.vault, card] });
    toast({ style: "frame button-primary", message: `Added “${card.name}” to your ${toLoad ? "loadout" : "vault"}.` });
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCard(form);
    setForm(emptyCard(classDomains[0] ?? "ARCANA"));
    setShowAdd(false);
  };

  const filterDomains = ["all", ...classDomains.map((d) => d.toUpperCase())];

  return (
    <>
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Domain Cards</div>
          <button className="button button-primary short" type="button" onClick={() => setShowAdd(true)}>
            <Icon name="plus" size={12} /> Add Card
          </button>
        </div>
        <div className="card-body">
          <div className={styles.filterRow}>
            {filterDomains.map((d) => (
              <button key={d} type="button" className="pill" data-active={filter === d ? "true" : undefined} onClick={() => setFilter(d)}>
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>
        </div>
      </Frame>

      {/* Loadout */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Loadout</div>
          <span className="mono" style={{ color: loadoutFull ? "var(--ember-2)" : "var(--gold-2)" }}>{cards.loadout.length}/{LOADOUT_CAP}</span>
        </div>
        <div className="card-body">
          {loadout.length === 0 ? (
            <span className={styles.empty}>No cards in your loadout{filter !== "all" ? " for this domain" : ""}.</span>
          ) : (
            <div className={styles.cardGrid}>
              {loadout.map((card, i) => (
                <DomainCardView key={`l-${card.name}-${i}`} card={card}>
                  <button className="button button-ghost short" type="button" onClick={() => toVault(card)}>
                    <Icon name="back" size={12} /> Vault
                  </button>
                  <button className="sf-icon-btn" type="button" onClick={() => remove(card, "loadout")} aria-label="Remove">
                    <Icon name="trash" size={13} />
                  </button>
                </DomainCardView>
              ))}
            </div>
          )}
        </div>
      </Frame>

      {/* Vault */}
      <Frame classes="card">
        <div className="card-hdr">
          <div className="card-title">Vault</div>
          <span className="mono" style={{ color: "var(--ink-dim)" }}>{cards.vault.length}</span>
        </div>
        <div className="card-body">
          {vault.length === 0 ? (
            <span className={styles.empty}>Your vault is empty{filter !== "all" ? " for this domain" : ""}.</span>
          ) : (
            <div className={styles.cardGrid}>
              {vault.map((card, i) => (
                <DomainCardView key={`v-${card.name}-${i}`} card={card}>
                  <button className="button button-ghost short" type="button" onClick={() => toLoadout(card)} disabled={loadoutFull}>
                    <Icon name="fwd" size={12} /> Loadout
                  </button>
                  <button className="sf-icon-btn" type="button" onClick={() => remove(card, "vault")} aria-label="Remove">
                    <Icon name="trash" size={13} />
                  </button>
                </DomainCardView>
              ))}
            </div>
          )}
        </div>
      </Frame>

      {/* Add card popup */}
      <Popup closerFunc={setShowAdd} toggle={showAdd}>
        <Frame classes="column-direction">
          <h3 className="card-title">Add Domain Card</h3>

          <form onSubmit={submitForm}>
            <div className={styles.formGrid}>
              <input className="input" placeholder="Card name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select className="select" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                {(classDomains.length ? classDomains : ["ARCANA"]).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input className="input" type="number" placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) || 1 })} />
              <input className="input" type="number" placeholder="Recall cost" value={form.recall} onChange={(e) => setForm({ ...form, recall: parseInt(e.target.value) || 0 })} />
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Ability</option>
                <option>Spell</option>
                <option>Grimoire</option>
              </select>
              <span />
            </div>
            <textarea className="textarea" rows={3} placeholder="Card text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} style={{ marginTop: "0.5rem" }} />
            <button type="submit" className="button button-accent stretch" style={{ marginTop: "0.5rem" }}>Add Custom Card</button>
          </form>

          {browseable.length > 0 && (
            <>
              <div className="rune-divider"><span className="rune" /></div>
              <span className={styles.sectionTitle}>From the {character.characterProfile.class} domains</span>
              <div className={styles.browseList}>
                {browseable.map((card) => (
                  <DomainCardView key={card.name} card={card}>
                    <button className="button button-primary short" type="button" onClick={() => addCard(card)}>
                      <Icon name="plus" size={12} /> Add
                    </button>
                  </DomainCardView>
                ))}
              </div>
            </>
          )}

          <button type="button" className="button button-secondary stretch" onClick={() => setShowAdd(false)} style={{ marginTop: "0.5rem" }}>Close</button>
        </Frame>
      </Popup>
    </>
  );
}

function Domains() {
  return <SheetShell active="domains">{(ctx) => <DomainsBody {...ctx} />}</SheetShell>;
}
