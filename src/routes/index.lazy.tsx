import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { BoxSection } from "../components/BoxSection/BoxSection";
import { Logo } from "../components/Logo/Logo";

import { useEffect, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useUserStore } from "../zustand/stores";

// import styles from "../routeStyles/index.module.css";

export const Route = createLazyFileRoute("/")({
	component: signinScreen,
});

function signinScreen() {
	const { setUser } = useUserStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	let user = getUserFromLocal();

	const login = async (e: any) => {
		e.preventDefault();
		await setUser(email, password);
		navigate({ to: "/profile" });
	};

	useEffect(() => {
		if (user) {
			navigate({ to: "/profile" });
		}
	}, []);

	return (
		<BoxSection classes="row-direction">
			<Logo />
			<form className="form boxSection column-direction" onSubmit={(e) => login(e)}>
				<div className="inputWrapper">
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						placeholder="example@gmail.com"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="boxSection input"
					/>
				</div>
				<div className="inputWrapper">
					<label htmlFor="pass">Password:</label>
					<input
						type="password"
						placeholder="*********"
						id="pass"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="boxSection input"
					/>
				</div>
				<button type="submit" className="button button-primary">
					Log in
				</button>
				<p className="text-content">
					Don't have an account?{" "}
					<a onClick={() => navigate({ to: "/signup" })}>
						Sign up here!
					</a>
				</p>
			</form>
		</BoxSection>
	);
}
