import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css';
import './global.css'


// Import the generated route tree  
import { routeTree } from './routeTree.gen'

// Create hash history
const hashHistory = createHashHistory()

// Create a new router instance.
// defaultPreload "intent" fetches a route's code-split chunk on hover/touch
// of a <Link>, so the screen is ready before navigation (avoids the
// first-load flicker while the chunk downloads).
const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: "intent",
  defaultPreloadDelay: 50,
})

const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
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
