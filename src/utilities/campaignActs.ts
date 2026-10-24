import { supabase } from "../supabase/supabase";

/* Data access for Campaign Acts (sql/add-campaign-acts.sql). The GM reads and
 * writes the table directly; RLS keeps everyone else out. Players read through
 * the get_revealed_campaign_acts RPC, which only returns revealed acts with
 * their revealed story modules. */

// GM only (RLS).
export const getCampaignActs = async (campaignID: string): Promise<CampaignAct[]> => {
	const { data, error } = await supabase.from("campaignActs").select("*").eq("campaignID", campaignID);
	if (error) throw error;
	return (data ?? []) as CampaignAct[];
};

// Seated players (and the GM): revealed acts only, secrets stripped.
export const getRevealedActs = async (campaignID: string): Promise<CampaignAct[]> => {
	const { data, error } = await supabase.rpc("get_revealed_campaign_acts", { cid: campaignID });
	if (error) throw error;
	return (data ?? []) as CampaignAct[];
};

export const createAct = async (campaignID: string, title: string, summary: string, sortOrder: number): Promise<CampaignAct | null> => {
	const { data, error } = await supabase
		.from("campaignActs")
		.insert({ campaignID, title, summary: summary || null, sortOrder })
		.select()
		.single();
	if (error) {
		console.error(error);
		return null;
	}
	return data as CampaignAct;
};

// Returns the saved act, or null if nothing was saved — an RLS-blocked update
// doesn't error, it just matches no rows.
export const updateAct = async (
	id: string,
	patch: Partial<Pick<CampaignAct, "title" | "summary" | "revealed" | "modules" | "sortOrder">>,
): Promise<CampaignAct | null> => {
	const { data, error } = await supabase.from("campaignActs").update(patch).eq("id", id).select();
	if (error) {
		console.error(error);
		return null;
	}
	return ((data ?? [])[0] as CampaignAct) ?? null;
};

// Same no-rows check as updateAct.
export const deleteAct = async (id: string): Promise<boolean> => {
	const { data, error } = await supabase.from("campaignActs").delete().eq("id", id).select("id");
	if (error) {
		console.error(error);
		return false;
	}
	return (data ?? []).length > 0;
};

// Persist the GM's act order (one update per moved act).
export const saveActOrder = async (acts: CampaignAct[]) => {
	await Promise.all(
		acts.map((a, i) =>
			a.sortOrder === i
				? Promise.resolve()
				: supabase.from("campaignActs").update({ sortOrder: i }).eq("id", a.id).then(({ error }) => {
						if (error) console.error(error);
					}),
		),
	);
};
