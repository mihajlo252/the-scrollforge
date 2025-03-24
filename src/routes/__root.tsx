import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from '../components/Navigation';
import { TicketsButton } from '../components/TicketsButton';


export const Route = createRootRoute({
  component: () => (
    <div className="flex h-[100svh] flex-col gap-5 px-10 py-5">
      <Navigation />

      <Outlet/>
      {/* <TanStackRouterDevtools /> */}
      <TicketsButton styles="cursor-pointer hover:scale-110 transition-all duration-150 ease-in absolute left-3 bottom-3 opacity-50 z-[99999]" color={"#d0a732"} size={50} strokeWidth={5} />
    </div>
  ),
})
