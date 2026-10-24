import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Logo } from "../components/Logo/Logo";
import { Icon, RuneDivider } from "../components/Primitives";
import { Load } from "../components/Load";
import { supabase } from "../supabase/supabase";
import { recoveryLinkError, updatePassword } from "../utilities/passwordReset";
import { signOut } from "../utilities/signOut";
import { toast } from "../utilities/toasterSonner";
import { useUserStore } from "../zustand/stores";

import styles from "../routeStyles/index.module.css";

export const Route = createLazyFileRoute("/reset-password")({
	component: ResetPassword,
});

// Supabase's default minimum password length.
const MIN_PASSWORD_LENGTH = 6;

function ResetPassword() {
	const navigate = useNavigate();
	const { setSessionUser } = useUserStore();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// The reset link signs the user in; without that session there is nothing to reset.
	const { data: hasSession, isPending: isChecking } = useQuery({
		queryKey: ["reset-password-session"],
		queryFn: async () => {
			if (recoveryLinkError) return false;
			const { data } = await supabase.auth.getSession();
			return Boolean(data.session);
		},
		gcTime: 0,
	});

	const { mutate, isPending } = useMutation({
		mutationFn: updatePassword,
		onSuccess: (user) => {
			setSessionUser(user);
			toast({ style: "bg-success text-base-100", message: "Your password has been changed." });
			navigate({ to: "/profile" });
		},
	});

	const backToSignIn = async () => {
		// Drop the reset session so the sign-in screen doesn't skip ahead to the profile.
		await signOut();
		navigate({ to: "/" });
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password.length < MIN_PASSWORD_LENGTH) {
			toast({ style: "bg-error text-base-100", message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
			return;
		}
		if (password !== confirmPassword) {
			toast({ style: "bg-error text-base-100", message: "Passwords don't match." });
			return;
		}
		mutate(password);
	};

	return (
		<section className={`frame ${styles.formBox}`}>
			<span className="frame-corner tl" />
			<span className="frame-corner tr" />
			<span className="frame-corner bl" />
			<span className="frame-corner br" />
			<Logo size="200" focusable={false} />
			<RuneDivider />
			{isChecking ? (
				<div className={styles.formIntro}>
					<Load />
				</div>
			) : hasSession ? (
				<motion.form
					className="form column-direction"
					onSubmit={submit}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
				>
					<div className={styles.formIntro}>
						<h2 className="text-content">Forge a New Password</h2>
						<p className="text-content">Choose a new password for your account.</p>
					</div>
					<div className="inputWrapper">
						<label className="text-content" htmlFor="new-pass">
							New Password
						</label>
						<input
							type="password"
							placeholder="*********"
							id="new-pass"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input text-content"
						/>
					</div>
					<div className="inputWrapper">
						<label className="text-content" htmlFor="confirm-pass">
							Confirm Password
						</label>
						<input
							type="password"
							placeholder="*********"
							id="confirm-pass"
							autoComplete="new-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="input text-content"
						/>
					</div>
					<button type="submit" className="button button-primary" disabled={isPending}>
						{isPending ? (
							<Load />
						) : (
							<>
								<Icon name="lock" size={16} /> Seal New Password
							</>
						)}
					</button>
					<button type="button" className={styles.textLink} onClick={backToSignIn}>
						Back to sign in
					</button>
				</motion.form>
			) : (
				<motion.div
					className="column-direction"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
				>
					<div className={styles.formIntro}>
						<h2 className="text-content">This Link Has Faded</h2>
						<p className="text-content">
							{recoveryLinkError ?? "This password reset link is invalid or has expired."} Request a new one from the sign-in screen.
						</p>
					</div>
					<button type="button" className="button button-primary" onClick={backToSignIn}>
						<Icon name="back" size={16} /> Back to Sign In
					</button>
				</motion.div>
			)}
		</section>
	);
}
