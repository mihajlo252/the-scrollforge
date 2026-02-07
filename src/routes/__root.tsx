import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from "../sections/Navigation";
import { BoxSection } from "../components/BoxSection";
import { ErrComp } from "../components/ErrComp";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen max-h-screen flex flex-col bg-base-300 bg-opacity-50 bg-[url('/logo-wide.png')] bg-cover bg-center bg-no-repeat p-2 px-10 pb-5  bg-blend-overlay">
      <Navigation />

        <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster theme="dark" />
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
