import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { createAct, deleteAct, getCampaignActs, getRevealedActs, saveActOrder, updateAct } from "../../../utilities/campaignActs";
import { toast } from "../../../utilities/toasterSonner";
import { sortActs } from "./actHelpers";

type ActPatch = Parameters<typeof updateAct>[1];

// Quiet period before table-side marks (HP, stress, countdowns) are written.
const TRACK_SAVE_DELAY = 700;

/* A campaign's acts plus the GM's write actions. The GM loads every act; a
 * player only gets the revealed ones. Writes update the cached list straight
 * away and roll back if Supabase refuses them. */
export function useCampaignActs(campaignID: string | undefined, isDM: boolean) {
	const qc = useQueryClient();
	const key = ["campaign-acts", campaignID, isDM ? "gm" : "player"];

	const query = useQuery({
		queryKey: key,
		queryFn: () => (isDM ? getCampaignActs(campaignID!) : getRevealedActs(campaignID!)),
		enabled: !!campaignID,
		// Only the GM writes acts, and a refetch could land on top of marks
		// that are still waiting to be saved.
		refetchOnWindowFocus: false,
	});
	const acts = useMemo(() => sortActs(query.data ?? []), [query.data]);

	const setActs = (fn: (acts: CampaignAct[]) => CampaignAct[]) => qc.setQueryData<CampaignAct[]>(key, (old) => fn(old ?? []));

	// Pending tracker writes, one timer per act.
	const timers = useRef(new Map<string, number>());
	const keyRef = useRef(key);
	keyRef.current = key;
	const flush = (actID: string) => {
		clearTimeout(timers.current.get(actID));
		timers.current.delete(actID);
		const latest = qc.getQueryData<CampaignAct[]>(keyRef.current)?.find((a) => a.id === actID);
		if (!latest) return;
		updateAct(actID, { modules: latest.modules }).then((saved) => {
			if (saved) return;
			toast({ style: "frame button-primary", message: "Couldn't save your marks." });
			qc.invalidateQueries({ queryKey: keyRef.current });
		});
	};
	// Leaving the screen writes whatever is still waiting.
	useEffect(
		() => () => {
			for (const actID of [...timers.current.keys()]) flush(actID);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const add = async (title: string, summary: string) => {
		const act = await createAct(campaignID!, title, summary, acts.length);
		if (!act) {
			toast({ style: "frame button-primary", message: "Couldn't create the act." });
			return null;
		}
		setActs((list) => [...list, act]);
		return act;
	};

	const save = async (id: string, patch: ActPatch) => {
		const before = qc.getQueryData<CampaignAct[]>(key);
		setActs((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
		const saved = await updateAct(id, patch);
		if (!saved) {
			qc.setQueryData(key, before);
			toast({ style: "frame button-primary", message: "Couldn't save the act." });
			return false;
		}
		// Keep the local copy rather than the response: tracker marks made
		// while this was saving would otherwise flicker back.
		return true;
	};

	const remove = async (id: string) => {
		const ok = await deleteAct(id);
		if (!ok) {
			toast({ style: "frame button-primary", message: "Couldn't delete the act." });
			return false;
		}
		setActs((list) => list.filter((a) => a.id !== id));
		return true;
	};

	// A mark during play (HP, stress, countdown tick): shown straight away,
	// written once the GM stops clicking.
	const track = (actID: string, moduleID: string, fn: (m: ActModule) => ActModule) => {
		setActs((list) =>
			list.map((a) => (a.id === actID ? { ...a, modules: a.modules.map((m) => (m.id === moduleID ? fn(m) : m)) } : a)),
		);
		clearTimeout(timers.current.get(actID));
		timers.current.set(
			actID,
			window.setTimeout(() => flush(actID), TRACK_SAVE_DELAY),
		);
	};

	const reorder = (ordered: CampaignAct[]) => {
		setActs(() => ordered.map((a, i) => ({ ...a, sortOrder: i })));
		saveActOrder(ordered);
	};

	return { acts, isLoading: query.isPending, add, save, remove, reorder, track };
}
