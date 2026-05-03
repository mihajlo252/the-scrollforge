import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from "../sections/Navigation/Navigation";
import { ErrComp } from "../components/ErrComp/ErrComp";
import { Toaster } from "sonner";
import styles from "../routeStyles/root.module.css";
import { useUserStore } from "../zustand/stores";

export const Route = createRootRoute({
	component: Root,
	errorComponent: () => <ErrComp />,
	notFoundComponent: () => <ErrComp />,
});

function Root() {
	const { user: id } = useUserStore();

	return (
		<>
			{id && <Navigation />}
			<main className={`${styles.main}`}>
				<Outlet />
			</main>
			{/* <TanStackRouterDevtools /> */}
			<Toaster theme="dark" />
		</>
	);
}
