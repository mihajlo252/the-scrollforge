import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Frame } from "../../components/Frame/Frame";
import { Icon } from "../../components/Primitives";
import { SheetTabs } from "../../sections/DnD/CharacterProfile/SheetTabs";
import { sendData } from "../../utilities/sendData";
import { toast } from "../../utilities/toasterSonner";
import styles from "./sheetScreens.module.css";

import pink from "/assets/pink.svg";
import white from "/assets/white.svg";
import purple from "/assets/purple.svg";
import yellow from "/assets/yellow.svg";
import red from "/assets/red.svg";
import regular from "/assets/regular.svg";

export const Route = createLazyFileRoute("/dnd/inspiration")({ component: Inspiration });

const EXCHANGE_COST = 3;

const GEMS: { key: keyof Inspiration; img: string; color: string; desc: string }[] = [
	{ key: "regular", img: regular, color: "var(--ink-dim)", desc: `Exchange ${EXCHANGE_COST} of these for one colored gem.` },
	{ key: "red", img: red, color: "var(--ember-2)", desc: "Auto natural 20!" },
	{ key: "pink", img: pink, color: "#d98cc0", desc: "+10 to AC and saving throws for two rounds." },
	{ key: "white", img: white, color: "#d9d9e8", desc: "Dead? Not dead!" },
	{ key: "purple", img: purple, color: "var(--arcane)", desc: "Get one straight answer from the DM." },
	{ key: "yellow", img: yellow, color: "var(--gold-2)", desc: "One Legendary action or Legendary resistance." },
];

function Inspiration() {
	const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
	const character: Character = state.character;

	const [insp, setInsp] = useState<Inspiration>(character.stats.inspiration);

	const handleIncrease = (key: keyof Inspiration) => {
		if (key === "regular") {
			setInsp((p) => ({ ...p, regular: p.regular + 1 }));
			return;
		}
		if (insp.regular < EXCHANGE_COST) {
			toast({ style: "", message: `Need ${EXCHANGE_COST} regular gems to exchange.` });
			return;
		}
		setInsp((p) => ({ ...p, regular: p.regular - EXCHANGE_COST, [key]: p[key] + 1 }));
	};

	const handleDecrease = (key: keyof Inspiration) => {
		setInsp((p) => (p[key] < 1 ? p : { ...p, [key]: p[key] - 1 }));
	};

	const handleSave = async () => {
		localStorage.setItem(
			"character",
			JSON.stringify({ state: { ...state, character: { ...character, stats: { ...character.stats, inspiration: insp } } }, version: 1 }),
		);
		await sendData("characters", character.id, { stats: { ...character.stats, inspiration: insp } });
		toast({ style: "", message: "Saved!" });
	};

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
			<SheetTabs active="inspiration" />

			{/* Header */}
			<Frame classes="card">
				<div className="card-body">
					<div className={styles.castHeader}>
						<div>
							<div className="caps">Inspiration</div>
							<div className={styles.castInfo}>
								<span className="mono" style={{ color: "var(--gold-2)" }}>
									{insp.regular}
								</span>{" "}
								regular gems available to exchange
							</div>
						</div>
						<div className={styles.spacer} />
						<button className="button button-primary short" onClick={handleSave} type="button">
							<Icon name="check" size={12} /> Save
						</button>
					</div>
				</div>
			</Frame>

			{/* Gem grid */}
			<div className={styles.inspGrid}>
				{GEMS.map(({ key, img, color, desc }) => {
					const isRegular = key === "regular";
					const canIncrease = isRegular || insp.regular >= EXCHANGE_COST;
					return (
						<Frame key={key} classes={`card ${styles.inspCard} ${isRegular ? styles.inspCardSpecial : ""}`}>
							<img src={img} alt={`${key} inspiration gem`} className={styles.inspGem} />
							<div className={styles.inspName} style={{ color }}>
								{key}
							</div>
							<div className={styles.inspCount}>{insp[key]}</div>
							<p className={styles.inspDesc}>{desc}</p>
							{!isRegular && <div className={styles.inspCost}>Costs {EXCHANGE_COST} regular</div>}
							<div className={styles.inspCounter}>
								<button
									type="button"
									className={`button button-ghost ${styles.inspStepper}`}
									onClick={() => handleDecrease(key)}
									disabled={insp[key] < 1}
									aria-label={`Decrease ${key}`}
								>
									−
								</button>
								<button
									type="button"
									className={`button button-ghost ${styles.inspStepper}`}
									onClick={() => handleIncrease(key)}
									disabled={!canIncrease}
									aria-label={`Increase ${key}`}
								>
									+
								</button>
							</div>
						</Frame>
					);
				})}
			</div>
		</motion.section>
	);
}
