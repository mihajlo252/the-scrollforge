import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/create-character/page2')({
  component: Page2
})

function Page2 () {
  return <div>Page 2</div>
}