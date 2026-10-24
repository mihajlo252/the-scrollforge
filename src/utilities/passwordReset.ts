import { toast } from "./toasterSonner";
import { supabase } from "../supabase/supabase";

export const RESET_PASSWORD_PATH = "/reset-password";

// Marks reset links so an expired one (which carries no `type=recovery`) can
// still be told apart from other auth redirects such as signup confirmation.
const RESET_MARKER = "reset";

// Set when the reset link was invalid or expired; read by the reset screen.
export let recoveryLinkError: string | null = null;

export const requestPasswordReset = async (email: string) => {
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${window.location.origin}${window.location.pathname}?${RESET_MARKER}=1`,
	});

	if (error) {
		toast({ style: "bg-error text-base-100", message: error.message });
		throw error;
	}
};

export const updatePassword = async (password: string) => {
	const { data, error } = await supabase.auth.updateUser({ password });

	if (error) {
		toast({ style: "bg-error text-base-100", message: error.message });
		throw error;
	}
	return data.user;
};

// Supabase sends the reset link back with the recovery session (or an error)
// in the URL hash, which the hash router would read as a route. Let supabase-js
// consume it first, then point the URL at the reset screen. Must run before the
// router is created. Resolves true when this page load is a reset link.
export const takeRecoveryRedirect = async () => {
	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.hash.slice(1));
	if (params.get("type") !== "recovery" && !url.searchParams.has(RESET_MARKER)) return false;

	// Resolves once supabase-js has stored the session from the hash.
	await supabase.auth.getSession();
	recoveryLinkError = params.get("error_description");
	window.history.replaceState(null, "", `${url.pathname}#${RESET_PASSWORD_PATH}`);
	return true;
};
