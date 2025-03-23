import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from '../components/Navigation';


export const Route = createRootRoute({
  component: () => (
    <div className="flex h-[100svh] flex-col gap-5 px-10 py-5">
      <Navigation />

      <Outlet/>
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
})
