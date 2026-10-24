import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css';
import './global.css'


// Import the generated route tree  
import { routeTree } from './routeTree.gen'

import { takeRecoveryRedirect } from './utilities/passwordReset'
import { useUserStore } from './zustand/stores'

// Create a new router instance with hash history.
// defaultPreload "intent" fetches a route's code-split chunk on hover/touch
// of a <Link>, so the screen is ready before navigation (avoids the
// first-load flicker while the chunk downloads).
const createAppRouter = () =>
  createRouter({
    routeTree,
    history: createHashHistory(),
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
  })

const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}

// Render the app. The router is created only after a password reset link has
// been handled, so it never sees the auth tokens in the hash.
takeRecoveryRedirect().then((isRecovery) => {
  // Whoever was signed in on this browser before is replaced by the reset session.
  if (isRecovery) useUserStore.getState().removeUser()

  const router = createAppRouter()
  const rootElement = document.getElementById('root')!
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>
    )
  }
})
