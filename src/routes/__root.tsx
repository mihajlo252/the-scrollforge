import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from "../sections/Navigation";
import { TicketsButton } from "../components/TicketsButton";
import { BoxSection } from "../components/BoxSection";
import { ErrComp } from "../components/ErrComp";
import { Toaster } from "sonner";

export const Route = createRootRoute({
    component: () => (
        <div className="flex h-[100svh] flex-col gap-5 bg-base-300 bg-opacity-50 bg-[url('/logo-wide.png')] bg-cover bg-center bg-no-repeat px-10 py-5 bg-blend-overlay">
            <Navigation />

            <Outlet />
            {/* <TanStackRouterDevtools /> */}
            <TicketsButton
                styles="cursor-pointer hover:scale-110 transition-all duration-150 ease-in absolute left-3 bottom-3 opacity-50 z-[99999] stroke-primary"
                size={30}
                strokeWidth={5}
            />
            <Toaster theme="dark"/>
        </div>
    ),
    errorComponent: () => (
        <BoxSection styles="w-full h-full flex flex-col place-self-center">
            <ErrComp />
        </BoxSection>
    ),
    notFoundComponent: () => (
        <BoxSection styles="w-full h-full flex flex-col justify-center items-center">
            <ErrComp />
        </BoxSection>
    ),
});
