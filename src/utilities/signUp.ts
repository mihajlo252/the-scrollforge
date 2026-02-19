import { toast } from "./toasterSonner";
import { supabase } from "../supabase/supabase";

export const signUp = async (email: string, password: string, username: string) => {
	const { data, error } = await supabase.auth.signUp({
		email: email,
		password: password,
		options: {
			data: {
				username: username,
			},
		},
	});

	if (error) {
		toast({ style: "bg-error text-base-100", message: error.message });
		throw error;
	}
	return {data, error};
};
