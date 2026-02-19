import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from "../sections/Navigation/Navigation";
import { ErrComp } from "../components/ErrComp/ErrComp";
import { Toaster } from "sonner";
import styles from "../routeStyles/root.module.css";

export const Route = createRootRoute({
	component: () => (
		<main className={styles.main}>
			<Navigation />
			<Outlet />

			{/* <TanStackRouterDevtools /> */}
			<Toaster theme="dark" />
		</main>
	),
	errorComponent: () => <ErrComp />,
	notFoundComponent: () => <ErrComp />,
});
