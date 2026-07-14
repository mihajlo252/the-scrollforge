import{O as D,r as i,j as e,P as x,F as C,I as p}from"./index-HRf3SnU6.js";import{g as w,h as n}from"./HelpCenter.module-C97Hu_8H.js";const A=`# Vitals sheet (Daggerheart)\r
\r
The **Vitals** tab is your main Daggerheart screen — traits, survival tracks, Hope, and your active kit at a glance. Everything saves automatically.\r
\r
## Traits\r
\r
Your six traits — **Agility, Strength, Finesse, Instinct, Presence, Knowledge**. The one marked with **✦** is your **Spellcast** trait. If equipped gear changes a trait, the value already includes it and a line notes the gear contribution.\r
\r
## Vitals card\r
\r
- **Evasion** and **Armor Score** (gear modifiers included), plus your **Proficiency**.\r
- **Armor Slots** — click a box to spend a slot when you mark armor; click again to clear.\r
- **Hit Points** — the HP track shows the **Minor / Major / Severe** damage bands with your threshold values between them. When you take damage, click boxes to mark HP: below Major marks 1, Major–Severe marks 2, at/above Severe marks 3, and a hit of at least **double** your Severe threshold marks 4.\r
- **Stress** — click boxes to mark and clear stress.\r
\r
## Hope\r
\r
Track **Hope** with the circular pips, and read your class's Hope feature right below.\r
\r
## The rest\r
\r
**Class Features** are listed for reference, **Active Weapons** summarizes your equipped primary and secondary (edit them on the Equipment tab), and **Gold** tracks Handfuls, Bags, and Chest with steppers.\r
`,j=`# Domains (Daggerheart)\r
\r
The **Domains** tab manages your domain cards — the abilities, spells, and grimoires drawn from your class's two domains.\r
\r
## Loadout vs. vault\r
\r
- **Loadout** — the cards you can actually use, capped at **5**. The counter turns red when it's full.\r
- **Vault** — everything else you own but haven't slotted.\r
- Move a card with **Vault** (send it back) or **Loadout** (bring it out). If your loadout is full, move a card to the vault first.\r
\r
Cards are grouped by level, and each shows its **Recall cost** (the Stress it takes to swap it back in from the vault during play).\r
\r
## Filtering\r
\r
Use the domain pills to show cards from just one of your domains, or **All**.\r
\r
## Adding cards\r
\r
**Add Card** lets you either:\r
\r
- **Pick from the catalog** — cards from your class's domains at or below your current level that you don't already own. New cards go to your loadout if there's room, otherwise the vault.\r
- **Create a custom card** — enter a name, domain, level, recall cost, type (Ability / Spell / Grimoire), and text. Handy for homebrew.\r
`,E=`# Equipment (Daggerheart)\r
\r
The **Equipment** tab is where you equip weapons and armor and carry your pack.\r
\r
## Weapons\r
\r
You have a **Primary** and a **Secondary** slot. Select the edit icon on a slot to:\r
\r
- **Pick from the catalog** — weapons up to your tier, listed with their tier and damage.\r
- **Enter one by hand** — name, trait, range, damage, physical/magic, burden (One- or Two-Handed), and an optional **feature**.\r
\r
**Clear** empties the slot. When a weapon's feature contains a recognized modifier (like \`+1 to Evasion\`), the card shows an **"Applies to your sheet"** line and that bonus is reflected in your Vitals automatically.\r
\r
## Active armor\r
\r
**Equip** armor from the catalog (tier-capped) or enter custom values — **Armor Score** and **Major / Severe thresholds**, plus an optional feature. Equipping armor updates your Vitals: Armor Score, armor slots, and thresholds. Note that the thresholds shown on your sheet add your level. Use **Unequip** to remove it.\r
\r
## Gold & inventory\r
\r
Track **Gold** (Handfuls, Bags, Chest) with steppers, and keep everything else in **Inventory** — each item has a name, quantity, and optional note.\r
`,I=`# Features (Daggerheart)\r
\r
The **Features** tab collects every ability your character has from their class, subclass, and heritage, and it's where you track Experiences.\r
\r
## Class features\r
\r
Your class features and your **Hope feature**, shown for quick reference during play.\r
\r
## Subclass\r
\r
Your subclass abilities are organized into three tiers:\r
\r
- **Foundation** — available from the start.\r
- **Specialization** — unlocks at **level 5**.\r
- **Mastery** — unlocks at **level 8**.\r
\r
Locked tiers are dimmed with an "unlocks at" hint until you reach that level (they also unlock through the level-up flow).\r
\r
## Heritage\r
\r
The features granted by your **ancestry** and **community**.\r
\r
## Experiences\r
\r
Experiences are short phrases that describe what your character is good at (like *Silver Tongue* or *Wilderness Survival*), each with a bonus you can add to fitting rolls.\r
\r
- Most heroes start with **two experiences at +2**.\r
- **Add** to create one with a name and bonus; use the edit and delete icons to change or remove it.\r
`,N=`# Journal (Daggerheart)\r
\r
The **Character** tab is your journal — identity, story, and advancement history in one place.\r
\r
## Identity & tier\r
\r
The top card shows your name, level, ancestry, community, class, and subclass, with a **tier bar** marking which tier you're in (T1: level 1, T2: levels 2–4, T3: levels 5–7, T4: levels 8–10).\r
\r
## Background & Connections\r
\r
Two sections for your character's story, written as prompt-and-answer entries:\r
\r
- **Background** — who your hero is and where they came from.\r
- **Connections** — your ties to the other player characters.\r
\r
Use **Add** to create an entry (a prompt and your answer), and the edit / delete icons to revise them.\r
\r
## Advancement\r
\r
The **Advancement** card holds the **Level Up** button and a running history of the advancements you've taken at each level. See **Leveling up** for how the level-up flow works. At level 10 the button reads **Max Level**.\r
`,q=`# Leveling up (Daggerheart)\r
\r
Advancing a level in Daggerheart is handled by the **level-up flow**.\r
\r
## Opening it\r
\r
Any of these start it:\r
\r
- The **Level Up** button on the **Vitals** top bar or the **Character** (journal) tab's Advancement card.\r
- Typing a **higher number** into the **LV** field on the top bar. If you jump several levels at once, the flow walks you through each level's choices one step at a time.\r
\r
## What a level grants\r
\r
Each level gives you:\r
\r
- **A new domain card** — every level grants one. Pick it at the top of the modal (it's added to your loadout or vault).\r
- **2 advancement points** to spend on the level's options (raising traits, more HP or Stress, a new domain card, subclass upgrades, and so on). The modal tracks your points and only enables **Advance** once you've spent exactly 2 and made every required choice.\r
\r
## Entering a new tier\r
\r
Crossing into a new tier (levels 2, 5, and 8) also grants **+1 Proficiency**, a **new Experience at +2**, and clears your marked traits. The modal calls this out when it applies.\r
\r
## Notes\r
\r
- The maximum level is **10**.\r
- Choices apply as you confirm each step, so a multi-level jump saves progress along the way.\r
`,H=`# Attacks (D&D)\r
\r
The **Attacks** tab is your arsenal — weapons, cantrip attacks, and other actions with their to-hit and damage.\r
\r
The header shows your **proficiency bonus** and how many actions you have.\r
\r
## Arsenal & details\r
\r
Your attacks are listed on the left; select one to see its details:\r
\r
- **Attack** — the to-hit bonus (for example \`+5\`).\r
- **Damage** — damage and type (for example \`1d8+3\`).\r
- **Range** and **Type** (Melee, Ranged, …).\r
- A free-form **description** for any extra rules.\r
\r
## Adding & editing\r
\r
**Add Attack** opens a form for the name, type, range, attack bonus, damage, and description. Open any attack and choose **Edit** to change it, or **Delete** to remove it. Values like the attack bonus are entered by hand, so you can capture any modifier your build needs.\r
`,P=`# Combat sheet (D&D)\r
\r
The **Combat** tab is your main D&D screen. It gathers everything you reach for in play: hit points, ability scores, resources, skills, and defenses. Every field saves automatically.\r
\r
## Vitals (HP)\r
\r
- **Current / Max HP** — the big number is your current HP; type your maximum in the field after the slash.\r
- **Adjust HP** — type an amount in the small box, then press **−** or **+** to subtract or add it. Leave the box empty to step by 1. **Hold** the **+** or **−** button to change HP continuously.\r
- **AC**, **Initiative** (from your Dexterity), and **Hit Dice** sit below.\r
- **Death Saves** — tap the success and failure dots to track them.\r
\r
## Abilities\r
\r
Your six ability scores — **STR, DEX, CON, INT, WIS, CHA**. Type a score and the modifier above it updates automatically.\r
\r
## Resources\r
\r
Shows any inspiration gems you've banked. The **+** jumps to the full **Inspiration** screen. A long rest restores expended resources.\r
\r
## Skills & Saves\r
\r
- **Saving throws** — tap a save to toggle proficiency.\r
- **Skills** — tap a skill to cycle through **not proficient → proficient → (expertise, if your class allows) → not proficient**. Modifiers are calculated from the linked ability plus your proficiency bonus.\r
\r
## Senses & Defenses\r
\r
Passive Perception, Investigation, and Insight, plus your proficiency bonus — all derived from your abilities and skill proficiencies.\r
`,R=`# Inspiration (D&D)\r
\r
The **Inspiration** tab tracks inspiration as gemstones — a house-rule take on the classic mechanic.\r
\r
## Regular gems\r
\r
You bank plain **regular** gems with the **+** / **−** steppers. These are the currency for everything else: spend **3 regular gems** to gain one colored gem.\r
\r
## Colored gems\r
\r
Each color is a one-shot boon. Exchange 3 regular gems to add one:\r
\r
- **Red** — auto natural 20.\r
- **Pink** — +10 to AC and saving throws for two rounds.\r
- **White** — Dead? Not dead!\r
- **Purple** — one straight answer from the DM.\r
- **Yellow** — one Legendary action or Legendary resistance.\r
\r
Each card shows how many you hold, its effect, and its cost. Use **−** to spend one when you cash it in. If you don't have enough regular gems to exchange, the app will let you know.\r
\r
The banked count also appears in the **Resources** card on your Combat sheet.\r
`,L=`# Inventory (D&D)\r
\r
The **Inventory** tab tracks your gear, coin, and carrying capacity.\r
\r
## Coin purse\r
\r
Enter your **platinum, gold, electrum, silver,** and **copper** (pp / gp / ep / sp / cp).\r
\r
## Encumbrance\r
\r
Your carried **weight** is totalled from each item's weight × quantity and compared against your **capacity** (Strength × 15). Go over and the sheet flags you as encumbered.\r
\r
## Equipped\r
\r
Items you mark as equipped are collected into a quick **Equipped** list so your active kit is easy to see.\r
\r
## Items\r
\r
- **Search** the item table by name.\r
- **Add Item** opens a form for the name, **type**, **rarity**, **quantity**, **weight**, optional **damage** and **note**, and an **Equipped** checkbox. Rarity is shown as a colored dot (common → legendary).\r
- Select the edit icon on any row to change or delete that item.\r
`,F=`# Spells (D&D)\r
\r
The **Spells** tab is your spellbook and slot tracker.\r
\r
## Spellcasting\r
\r
Pick your **spellcasting ability** from the dropdown. Your **Save DC** and **spell attack bonus** are calculated automatically from that ability's modifier and your proficiency bonus.\r
\r
## Spell slots\r
\r
The slot rail shows your slots per level as filled/empty dots.\r
\r
- **Set slots** — the **Slots** button (gear) opens a panel where you enter how many slots you have at each level.\r
- **Filter** — click a level on the rail to show only spells of that level in the spellbook; click again to clear.\r
- **Restore** — the **Restore** button (moon) resets all expended slots, e.g. after a long rest.\r
\r
## Spellbook & details\r
\r
Spells are grouped by level (cantrips first). Prepared spells show a brighter marker. Select a spell to see its **range, casting time, duration, components,** and description on the right.\r
\r
- **Cast a spell** — for leveled spells, the **Cast at** buttons expend one slot at the level you choose.\r
- **Edit / Delete** — from the detail panel.\r
\r
## Adding a spell\r
\r
**Add Spell** opens a form for the name, level, school, type, casting time, range, duration, components, and description, plus a **Prepared** checkbox.\r
`,M=`# Traits (D&D)\r
\r
The **Traits** tab is where you keep your features, racial traits, and other notable abilities in one searchable place.\r
\r
## Browsing\r
\r
- **Search** the sidebar to find a trait by name or text.\r
- **Categories** — filter by **Features & Traits** or **Racial Traits**. **All traits** shows everything, with a count next to each category.\r
\r
## Adding & editing\r
\r
**Add Trait** opens a form with:\r
\r
- **Name** and an optional **subtitle**.\r
- **Category** — Features & Traits or Racial Traits.\r
- **Chips** — short tags, entered comma-separated (for example \`Damage: 4d6, Reaction\`). A chip containing "drawback" is styled as a warning.\r
- **Description** — the full rules text.\r
\r
## Working with cards\r
\r
Each trait is a card. **Select a card** to expand its description, where **Edit** and **Delete** live. Use the **drag handle** to reorder cards into whatever arrangement you like.\r
`,V=`# Chat, support & themes\r
\r
A few app-wide extras live outside the character sheets.\r
\r
## Chat\r
\r
The **Chat** button in the top nav opens realtime chat rooms — handy for coordinating with the rest of your table between or during sessions.\r
\r
## Help & Support\r
\r
In the account menu (the person icon, top-right) you'll find **Help & Support**. That's the place to report a bug or request a feature — it opens a ticket form and keeps a log of what you've submitted. (This is different from the **Guide** you're reading now, which explains how to use the app.)\r
\r
## Theme\r
\r
The **theme toggle** switches between the dark look and a light "parchment" look. Your choice is remembered on this device.\r
\r
## Account\r
\r
The same account menu shows who you're signed in as and holds **Sign Out**.\r
`,Y=`# Creating a character\r
\r
New characters are forged from the **profile hub**.\r
\r
1. Select **Forge New Hero**.\r
2. **Choose a system** — Dungeons & Dragons or Daggerheart. This decides which sheet and screens the character gets, and it can't be swapped later.\r
3. Fill in the **creation form** and confirm.\r
\r
Your new hero is saved to the cloud and appears as a card on the profile hub. Open the card to start playing.\r
\r
## What each system asks for\r
\r
- **Dungeons & Dragons** — name, race (and subrace), class (and subclass), level, and your six ability scores. You can fine-tune everything later on the sheet.\r
- **Daggerheart** — name, ancestry, community, class, and subclass, along with your traits, starting equipment, domain cards, and experiences.\r
\r
Nothing you enter at creation is locked in (aside from the system itself) — ability scores, gear, spells, cards, and level are all editable from the character's sheet whenever you like.\r
`,G=`# Navigating a sheet\r
\r
Every character sheet shares the same two pieces of chrome: a **tab bar** and a **top bar**.\r
\r
## Tab bar\r
\r
The row of tabs switches between the character's screens — for D&D that's Combat, Spells, Traits, Attacks, Inventory, and Inspiration; for Daggerheart it's Vitals, Domains, Features, Equipment, and Character (journal). Selecting a tab takes you straight there.\r
\r
## Top bar\r
\r
- **Name & level** — your character's name, with an editable **LV** field. Type a new number to change your level.\r
- **Class / ancestry line** — a quick summary of race/class (D&D) or ancestry, community, class, and subclass (Daggerheart).\r
- **Notes** — opens a free-form notes pad. It autosaves as you type.\r
- **Roll** — opens the 3D dice roller.\r
\r
Daggerheart sheets add a few more: a **Tier** badge, a **PDF** button that downloads a printable, filled-out sheet, a **Level Up** button, and a **Conditions** row for tracking status effects. On Daggerheart, typing a *higher* level into the LV field opens the level-up flow so you can choose each new level's advancements — see **Leveling up**.\r
\r
## Saving\r
\r
You never have to hit save. Every change writes locally right away and syncs to the cloud automatically.\r
`,W=`# The profile hub\r
\r
The profile hub is home base — every character you've made lives here as a card, and it's where you create new ones.\r
\r
## Characters\r
\r
- **Open a sheet** — select a character card. The Scrollforge loads that character and takes you to its main screen.\r
- **Filter by system** — use the **All / Daggerheart / Dungeons & Dragons** filters to narrow the grid. Each shows a count so you can see how many of each you have.\r
- **Reorder** — drag a card to rearrange the grid. Your order is remembered. (Reordering happens within whatever filter is active.)\r
- **Delete** — remove a character from its card. Deletion is permanent, so you'll be asked to confirm.\r
\r
## Making a new one\r
\r
Select **Forge New Hero** to start the creation flow — see **Creating a character** for the walkthrough.\r
\r
## Getting back here\r
\r
From anywhere in the app, the **Back** button in the top nav returns you to the profile hub.\r
`,O=`# Welcome to The Scrollforge\r
\r
The Scrollforge is a digital character sheet for tabletop RPGs. It supports two systems — **Dungeons & Dragons** and **Daggerheart** — and every character you make is saved to the cloud and kept available offline, so your sheet is ready wherever you play.\r
\r
## Finding your way around\r
\r
- **The profile hub** is your home base. Every character you create appears there as a card. Open a card to jump into that character's sheet.\r
- **Each sheet** has a **tab bar** for switching between screens (combat, spells, inventory, and so on) and a **top bar** with your level, a dice roller, and quick notes.\r
- The account menu (the person icon, top-right) holds this **Guide**, **Help & Support**, the **theme** toggle, and **Sign Out**.\r
\r
## Using this guide\r
\r
Topics on the left are grouped into **Getting Started**, **Dungeons & Dragons**, and **Daggerheart**. Use the search box at the top to jump straight to what you need — it searches both titles and the text inside each topic. When you open the guide, it starts on the topic that matches the screen you were just looking at.\r
\r
New here? Start with **Creating a character**, then **Navigating a sheet**.\r
`,U=Object.assign({"./guide/daggerheart/character.md":A,"./guide/daggerheart/domains.md":j,"./guide/daggerheart/equipment.md":E,"./guide/daggerheart/features.md":I,"./guide/daggerheart/journal.md":N,"./guide/daggerheart/leveling-up.md":q,"./guide/dnd/attacks.md":H,"./guide/dnd/character.md":P,"./guide/dnd/inspiration.md":R,"./guide/dnd/inventory.md":L,"./guide/dnd/spells.md":F,"./guide/dnd/traits.md":M,"./guide/getting-started/chat-support-themes.md":V,"./guide/getting-started/creating-a-character.md":Y,"./guide/getting-started/navigating-a-sheet.md":G,"./guide/getting-started/the-profile-hub.md":W,"./guide/getting-started/welcome.md":O}),t=(a,o,l,s)=>({id:a,title:o,mode:l,file:s,body:U[s]??`# ${o}

_Content coming soon._`}),m=[{label:"Getting Started",mode:"general",topics:[t("general-welcome","Welcome","general","./guide/getting-started/welcome.md"),t("general-creating-a-character","Creating a character","general","./guide/getting-started/creating-a-character.md"),t("general-profile-hub","The profile hub","general","./guide/getting-started/the-profile-hub.md"),t("general-navigating-a-sheet","Navigating a sheet","general","./guide/getting-started/navigating-a-sheet.md"),t("general-chat-support-themes","Chat, support & themes","general","./guide/getting-started/chat-support-themes.md")]},{label:"Dungeons & Dragons",mode:"dnd",topics:[t("dnd-character","Combat sheet","dnd","./guide/dnd/character.md"),t("dnd-spells","Spells","dnd","./guide/dnd/spells.md"),t("dnd-traits","Traits","dnd","./guide/dnd/traits.md"),t("dnd-attacks","Attacks","dnd","./guide/dnd/attacks.md"),t("dnd-inventory","Inventory","dnd","./guide/dnd/inventory.md"),t("dnd-inspiration","Inspiration","dnd","./guide/dnd/inspiration.md")]},{label:"Daggerheart",mode:"daggerheart",topics:[t("daggerheart-character","Vitals sheet","daggerheart","./guide/daggerheart/character.md"),t("daggerheart-domains","Domains","daggerheart","./guide/daggerheart/domains.md"),t("daggerheart-features","Features","daggerheart","./guide/daggerheart/features.md"),t("daggerheart-equipment","Equipment","daggerheart","./guide/daggerheart/equipment.md"),t("daggerheart-journal","Journal","daggerheart","./guide/daggerheart/journal.md"),t("daggerheart-leveling-up","Leveling up","daggerheart","./guide/daggerheart/leveling-up.md")]}],k=m.flatMap(a=>a.topics),B=a=>k.find(o=>o.id===a),z=a=>{const l=a.split("/").filter(Boolean).slice(-2).join("-");return k.some(s=>s.id===l)?l:a.startsWith("/profile")?"general-profile-hub":"general-welcome"};w.setOptions({breaks:!0,gfm:!0});const K=({toggle:a,closerFunc:o})=>{const l=D({select:r=>r.location.pathname}),[s,y]=i.useState("general-welcome"),[u,b]=i.useState(""),[_,g]=i.useState(!1);i.useEffect(()=>{a&&(y(z(l)),b(""),g(!1))},[a,l]);const c=u.trim().toLowerCase(),v=i.useMemo(()=>c?m.map(r=>({...r,topics:r.topics.filter(d=>d.title.toLowerCase().includes(c)||d.body.toLowerCase().includes(c))})).filter(r=>r.topics.length>0):m,[c]),h=B(s),T=i.useMemo(()=>h?w.parse(h.body):"",[h]),f=i.useRef(null);i.useEffect(()=>{var r;(r=f.current)==null||r.scrollTo(0,0)},[s]);const S=r=>{y(r),g(!0)};return e.jsx(x,{closerFunc:o,toggle:a,children:e.jsxs(C,{classes:`column-direction ${n.frame}`,children:[e.jsxs("div",{className:n.header,children:[e.jsx("div",{className:"card-title",children:"Guide"}),e.jsxs("div",{className:n.search,children:[e.jsx(p,{name:"search",size:15}),e.jsx("input",{className:"input",placeholder:"Search the guide…",value:u,onChange:r=>b(r.target.value),"aria-label":"Search the guide"})]}),e.jsx("button",{type:"button",className:"sf-icon-btn",onClick:()=>o(!1),"aria-label":"Close guide",children:e.jsx(p,{name:"close",size:16})})]}),e.jsxs("div",{className:n.body,"data-reading":_?"":void 0,children:[e.jsxs("nav",{className:n.list,"aria-label":"Guide topics",children:[v.length===0&&e.jsxs("div",{className:n.empty,children:["No topics match “",u,"”."]}),v.map(r=>e.jsxs("div",{className:n.group,children:[e.jsx("span",{className:"caps",children:r.label}),r.topics.map(d=>e.jsx("button",{type:"button",className:n.topicBtn,"data-active":d.id===s?"":void 0,onClick:()=>S(d.id),children:d.title},d.id))]},r.label))]}),e.jsxs("article",{className:n.reader,ref:f,children:[e.jsxs("button",{type:"button",className:`button button-ghost short ${n.backBtn}`,onClick:()=>g(!1),children:[e.jsx(p,{name:"back",size:14})," Topics"]}),h?e.jsx("div",{className:`text-content ${n.markdown}`,dangerouslySetInnerHTML:{__html:T}}):e.jsx("div",{className:n.empty,children:"Select a topic to read."})]})]})]})})};export{K as HelpCenter,K as default};
