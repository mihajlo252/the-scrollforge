import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navigation } from '../components/Navigation';


export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen flex-col gap-5 overflow-hidden px-10 py-5">
      <Navigation />

      <Outlet/>
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
})
