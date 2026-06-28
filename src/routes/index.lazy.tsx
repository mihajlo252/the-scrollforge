import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "../components/Logo/Logo";

import { useEffect, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useUserStore } from "../zustand/stores";
import { Icon, RuneDivider } from "../components/Primitives";

import styles from "../routeStyles/index.module.css";
import { signUp } from "../utilities/signUp";
import { useMutation } from "@tanstack/react-query";
import { Load } from "../components/Load";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const navigate = useNavigate();
	const [currentForm, setCurrentForm] = useState("login");

	let user = getUserFromLocal();

	const setForm: any = (formType: string, { fromCreate, e }: { fromCreate?: boolean; e?: React.MouseEvent<HTMLButtonElement> }) => {
		const activeButtonNodes = document.querySelectorAll(".tab[data-active]");
		const activeButtons = Array.from(activeButtonNodes);
		activeButtons.forEach((b) => {
			b.setAttribute("data-active", "false");
		});

		if (fromCreate) {
			activeButtons[0].setAttribute("data-active", "true");
		} else {
			e!.preventDefault();

			e!.currentTarget!.setAttribute("data-active", "true");
		}

		setCurrentForm(formType);
	};

	useEffect(() => {
		if (user) {
			navigate({ to: "/profile" });
		}
	}, []);

	return (
		<AnimatePresence>
			<motion.section
				className={`${styles.landingPage}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
			>
				<section className={styles.landingHeroSection}>
					<div>
						<p className="caps" style={{ color: "var(--gold-deep)" }}>
							Est. in the Age of Ink
						</p>
						<h1 className="text-content">
							Every hero <br />
							<span className="alternate">begins</span> with a scroll
						</h1>
					</div>
					<p>
						A living character sheet for D&D, Daggerheart, and every tale between. Tracked, rolled, and remembered — so you can keep
						your eyes on the table.
					</p>
					<RuneDivider />
				</section>
				<section className={`frame ${styles.formBox}`}>
					<span className="frame-corner tl" />
					<span className="frame-corner tr" />
					<span className="frame-corner bl" />
					<span className="frame-corner br" />
					<Logo focusable={false} />
					<RuneDivider />
					<div className="column-direction">
						<div className="tabs full">
							<button className="tab stretch" onClick={(e) => setForm("login", { e })} data-active="true">
								Sign In
							</button>
							<button className="tab stretch" onClick={(e) => setForm("createaccount", { e })} data-active="false">
								Create Account
							</button>
						</div>
						{currentForm == "login" && <LoginForm />}
						{currentForm == "createaccount" && <CreateAccountForm setForm={setForm} />}
					</div>
				</section>
			</motion.section>
		</AnimatePresence>
	);
}

const LoginForm = () => {
	const { setUser } = useUserStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();
	const login = async (e: any) => {
		e.preventDefault();
		await setUser(email, password);
		navigate({ to: "/profile" });
	};
	return (
		<motion.form
			className="form column-direction"
			onSubmit={(e) => login(e)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
		>
			<div className="inputWrapper">
				<label className="text-content" htmlFor="email">
					Email
				</label>
				<input
					type="email"
					placeholder="Enter your email..."
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="input text-content"
				/>
			</div>
			<div className="inputWrapper">
				<label className="text-content" htmlFor="pass">
					Password
				</label>
				<input
					type="password"
					placeholder="*********"
					id="pass"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="input text-content"
				/>
			</div>
			<button type="submit" className="button button-primary">
				<Icon name="scroll" size={16} /> Unroll My Scroll
			</button>
		</motion.form>
	);
};

function CreateAccountForm({ setForm }: { setForm: any }) {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	let user = getUserFromLocal();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ email, password, username }: { email: string; password: string; username: string }) => signUp(email, password, username),
		onSuccess: () => {
			setSuccess(true);
			setTimeout(() => {
				setForm("login", { fromCreate: true });
				setTimeout(() => {
					setSuccess(false);
				}, 0);
			}, 5000);
		},
	});

	const newUserSignUp = async (e: any) => {
		e.preventDefault();
		await mutateAsync({ email, password, username });
	};

	if (user) {
		navigate({ to: "/profile" });
	}

	return (
		<motion.form
			onSubmit={(e) => newUserSignUp(e)}
			className="form column-direction"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: .35, ease: "easeOut", delay: 0 }}
		>
			<div className="inputWrapper">
				<label htmlFor="username">Username</label>
				<input
					type="text"
					placeholder="Username"
					id="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="input text-content"
				/>
			</div>
			<div className="inputWrapper">
				<label htmlFor="email">Email</label>
				<input
					type="email"
					placeholder="example@gmail.com"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="input text-content"
				/>
			</div>
			<div className="inputWrapper">
				<label htmlFor="pass">Password</label>
				<input
					type="password"
					placeholder="*********"
					id="pass"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="input text-content"
				/>
			</div>
			<button type="submit" className={"button button-primary"}>
				{isPending ? (
						<Load />
					) : (
						<>
							<Icon name="scroll" size={16} /> Forge My Scroll
						</>
					)}
			</button>
			{success && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
					className={`${styles.createAccountOverlay}`}
				>
					<p className="text-content">
						You have successfully created your account! We've sent you a confirmation link to your email address. Please confirm your
						account.
					</p>
				</motion.div>
			)}
		</motion.form>
	);
}
