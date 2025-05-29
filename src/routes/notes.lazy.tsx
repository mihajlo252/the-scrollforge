import { createLazyFileRoute } from '@tanstack/react-router'
import { Notes } from '../sections/Notes/Notes'

export const Route = createLazyFileRoute('/notes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Notes />
}
