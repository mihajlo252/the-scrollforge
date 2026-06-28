import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<>
			{id && <Navigation />}
			<main className={`${styles.main}`}>
				{/* Keyed by pathname so each navigation replays a smooth, eased
				    fade + slide. (Enter-only: AnimatePresence exit is unreliable
				    with TanStack's shared Outlet.) */}
				<motion.div
					key={pathname}
					className={styles.pageWrap}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
				>
					<Outlet />
				</motion.div>
			</main>
			{/* <TanStackRouterDevtools /> */}
			<Toaster theme="dark" />
		</>
	);
}
