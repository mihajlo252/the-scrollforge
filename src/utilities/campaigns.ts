import { supabase } from "../supabase/supabase";
import { toast } from "./toasterSonner";

/* Data access for the Campaigns feature. Mirrors the style of the other
 * utilities (submitCharacter / getData / sendData) — thin wrappers over the
 * shared Supabase client. Campaigns are party-like groups WITHOUT chat; a
 * campaign is locked to one `gamemode` and only characters of that system can
 * join. Players request to join (status 'pending'); the GM accepts. */

export const createCampaign = async (
	name: string,
	dmID: string,
	dmName: string,
	gamemode: string,
	glyph: string,
	description?: string,
) => {
	const { data, error } = await supabase
		.from("campaigns")
		.insert({ name, dmID, dmName, gamemode, glyph, description })
		.select()
		.single();
	if (error) {
		toast({ style: "frame button-primary", message: `Failed to create the campaign. ${error.message}` });
		throw error;
	}
	return data as Campaign;
};

export const getAllCampaigns = async (): Promise<Campaign[]> => {
	const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
	if (error) throw error;
	return (data ?? []) as Campaign[];
};

export const getCampaignsForDM = async (dmID: string): Promise<Campaign[]> => {
	const { data, error } = await supabase.from("campaigns").select("*").eq("dmID", dmID).order("created_at", { ascending: false });
	if (error) throw error;
	return (data ?? []) as Campaign[];
};

// Every campaign-membership row for this player (any status), used to show the
// player which campaigns they've requested/joined and with which character.
export const getMyMemberships = async (profileID: string): Promise<CampaignCharacter[]> => {
	const { data, error } = await supabase.from("campaignCharacters").select("*").eq("profileID", profileID);
	if (error) throw error;
	return (data ?? []) as CampaignCharacter[];
};

export const requestJoinCampaign = async (campaignID: string, characterID: string, profileID: string, playerName: string) => {
	const { error } = await supabase
		.from("campaignCharacters")
		.insert({ campaignID, characterID, profileID, playerName, status: "pending" });
	if (error) {
		toast({ style: "frame button-primary", message: `Couldn't send the join request. ${error.message}` });
		throw error;
	}
};

// Every membership row the caller is allowed to see, across all campaigns:
// accepted rows (party sizes on Browse), plus my own requests and everything in
// campaigns I run. RLS does the filtering.
export const getVisibleRosterRows = async (): Promise<CampaignCharacter[]> => {
	const { data, error } = await supabase.from("campaignCharacters").select("*");
	if (error) throw error;
	return (data ?? []) as CampaignCharacter[];
};

// All membership rows for a campaign (pending + accepted) so the GM can triage.
export const getCampaignRoster = async (campaignID: string): Promise<CampaignCharacter[]> => {
	const { data, error } = await supabase.from("campaignCharacters").select("*").eq("campaignID", campaignID);
	if (error) throw error;
	return (data ?? []) as CampaignCharacter[];
};

// The GM's cross-user read: load full character rows by id (the roster).
export const getCharactersByIds = async (ids: string[]): Promise<(Character | DaggerheartCharacter)[]> => {
	if (ids.length === 0) return [];
	const { data, error } = await supabase.from("characters").select("*").in("id", ids);
	if (error) throw error;
	return (data ?? []) as (Character | DaggerheartCharacter)[];
};

export const setMemberStatus = async (id: string, status: string): Promise<boolean> => {
	const { error } = await supabase.from("campaignCharacters").update({ status }).eq("id", id);
	if (error) {
		console.error(error);
		return false;
	}
	return true;
};

export const removeMember = async (id: string): Promise<boolean> => {
	const { error } = await supabase.from("campaignCharacters").delete().eq("id", id);
	if (error) {
		console.error(error);
		return false;
	}
	return true;
};

// GM only (RLS). Members' campaignCharacters rows are removed by the cascade.
// RLS-blocked deletes don't error, they just match nothing — so confirm a row
// actually came back.
export const deleteCampaign = async (id: string): Promise<boolean> => {
	const { data, error } = await supabase.from("campaigns").delete().eq("id", id).select("id");
	if (error) {
		console.error(error);
		return false;
	}
	return (data ?? []).length > 0;
};

// Persist the GM's party order (one update per moved row).
export const savePartyOrder = async (rows: CampaignCharacter[]) => {
	await Promise.all(
		rows.map((r, i) =>
			r.sortOrder === i
				? Promise.resolve()
				: supabase.from("campaignCharacters").update({ sortOrder: i }).eq("id", r.id).then(({ error }) => {
						if (error) console.error(error);
					}),
		),
	);
};
