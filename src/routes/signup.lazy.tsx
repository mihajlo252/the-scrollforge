import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { BoxSection } from "../components/BoxSection/BoxSection";
import { useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { signUp } from "../utilities/signUp";

import { Logo } from "../components/Logo/Logo";

export const Route = createLazyFileRoute("/signup")({
	component: signUpScreen,
});

function signUpScreen() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	let user = getUserFromLocal();

	const newUserSignUp = async (e: any) => {
		e.preventDefault();
		const { error } = await signUp(email, password, username);
		if (!error) {
			navigate({ to: "/thanks" });
		}
	};

	if (user) {
		navigate({ to: "/profile" });
	}

	return (
		<BoxSection classes="row-direction">
			<Logo />
			<form onSubmit={(e) => newUserSignUp(e)} className="boxSection column-direction form">
				<div className="inputWrapper">
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						placeholder="Username"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="boxSection input"
					/>
				</div>
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
				<button type="submit" className={"button button-primary"}>Sign Up</button>
				<p className="text-content">
					Already have an account?{" "}
					<a onClick={() => navigate({ to: "/" })}>
						Sign in here!
					</a>
				</p>
			</form>
		</BoxSection>
	);
}
