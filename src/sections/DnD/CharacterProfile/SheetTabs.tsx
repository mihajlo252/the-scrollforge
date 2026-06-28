import { useNavigate } from "@tanstack/react-router";
import { TabBar } from "../../../components/Primitives";
import styles from "./sheet.module.css";

export const SHEET_TABS = [
	{ id: "combat", label: "Combat", icon: "sword", to: "/dnd/character" },
	{ id: "spells", label: "Spells", icon: "sparkle", to: "/dnd/spells" },
	{ id: "traits", label: "Traits", icon: "scroll", to: "/dnd/traits" },
	{ id: "attacks", label: "Attacks", icon: "bolt", to: "/dnd/attacks" },
	{ id: "inventory", label: "Inventory", icon: "bag", to: "/dnd/inventory" },
	{ id: "inspiration", label: "Inspiration", icon: "star", to: "/dnd/inspiration" },
] as const;

export const SheetTabs = ({ active }: { active: string }) => {
	const navigate = useNavigate();
	return (
		<div className={styles.tabsRow}>
			<TabBar
				tabs={SHEET_TABS}
				active={active}
				onChange={(id: string) => {
					const tab = SHEET_TABS.find((t) => t.id === id);
					if (tab && tab.id !== active) navigate({ to: tab.to });
				}}
			/>
		</div>
	);
};
