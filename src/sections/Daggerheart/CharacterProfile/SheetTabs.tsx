import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { TabBar } from "../../../components/Primitives";
import styles from "./sheet.module.css";

export const DH_SHEET_TABS = [
	{ id: "vitals", label: "Vitals", icon: "heart", to: "/daggerheart/character" },
	{ id: "domains", label: "Domains", icon: "sparkle", to: "/daggerheart/domains" },
	{ id: "features", label: "Features", icon: "scroll", to: "/daggerheart/features" },
	{ id: "equipment", label: "Equipment", icon: "sword", to: "/daggerheart/equipment" },
	{ id: "character", label: "Character", icon: "user", to: "/daggerheart/journal" },
] as const;

export const SheetTabs = ({ active }: { active: string }) => {
	const navigate = useNavigate();
	const router = useRouter();

	// Preload every sibling tab's code-split chunk up front so switching tabs is
	// instant (no first-load flicker) — same trick as the D&D sheet.
	useEffect(() => {
		DH_SHEET_TABS.forEach((t) => {
			Promise.resolve(router.preloadRoute({ to: t.to })).catch(() => {});
		});
	}, [router]);

	return (
		<div className={styles.tabsRow}>
			<TabBar
				tabs={DH_SHEET_TABS}
				active={active}
				onChange={(id: string) => {
					const tab = DH_SHEET_TABS.find((t) => t.id === id);
					if (tab && tab.id !== active) navigate({ to: tab.to });
				}}
			/>
		</div>
	);
};
