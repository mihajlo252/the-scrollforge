/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const TraitsLazyImport = createFileRoute('/traits')()
const TicketsLazyImport = createFileRoute('/tickets')()
const ThanksLazyImport = createFileRoute('/thanks')()
const SpellsLazyImport = createFileRoute('/spells')()
const SignupLazyImport = createFileRoute('/signup')()
const ProfileLazyImport = createFileRoute('/profile')()
const NotesLazyImport = createFileRoute('/notes')()
const InspirationLazyImport = createFileRoute('/inspiration')()
const ChatLazyImport = createFileRoute('/chat')()
const CharacterLazyImport = createFileRoute('/character')()
const AttacksLazyImport = createFileRoute('/attacks')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const TraitsLazyRoute = TraitsLazyImport.update({
  id: '/traits',
  path: '/traits',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/traits.lazy').then((d) => d.Route))

const TicketsLazyRoute = TicketsLazyImport.update({
  id: '/tickets',
  path: '/tickets',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/tickets.lazy').then((d) => d.Route))

const ThanksLazyRoute = ThanksLazyImport.update({
  id: '/thanks',
  path: '/thanks',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/thanks.lazy').then((d) => d.Route))

const SpellsLazyRoute = SpellsLazyImport.update({
  id: '/spells',
  path: '/spells',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/spells.lazy').then((d) => d.Route))

const SignupLazyRoute = SignupLazyImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/signup.lazy').then((d) => d.Route))

const ProfileLazyRoute = ProfileLazyImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/profile.lazy').then((d) => d.Route))

const NotesLazyRoute = NotesLazyImport.update({
  id: '/notes',
  path: '/notes',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/notes.lazy').then((d) => d.Route))

const InspirationLazyRoute = InspirationLazyImport.update({
  id: '/inspiration',
  path: '/inspiration',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/inspiration.lazy').then((d) => d.Route))

const ChatLazyRoute = ChatLazyImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/chat.lazy').then((d) => d.Route))

const CharacterLazyRoute = CharacterLazyImport.update({
  id: '/character',
  path: '/character',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/character.lazy').then((d) => d.Route))

const AttacksLazyRoute = AttacksLazyImport.update({
  id: '/attacks',
  path: '/attacks',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/attacks.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/attacks': {
      id: '/attacks'
      path: '/attacks'
      fullPath: '/attacks'
      preLoaderRoute: typeof AttacksLazyImport
      parentRoute: typeof rootRoute
    }
    '/character': {
      id: '/character'
      path: '/character'
      fullPath: '/character'
      preLoaderRoute: typeof CharacterLazyImport
      parentRoute: typeof rootRoute
    }
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatLazyImport
      parentRoute: typeof rootRoute
    }
    '/inspiration': {
      id: '/inspiration'
      path: '/inspiration'
      fullPath: '/inspiration'
      preLoaderRoute: typeof InspirationLazyImport
      parentRoute: typeof rootRoute
    }
    '/notes': {
      id: '/notes'
      path: '/notes'
      fullPath: '/notes'
      preLoaderRoute: typeof NotesLazyImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileLazyImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupLazyImport
      parentRoute: typeof rootRoute
    }
    '/spells': {
      id: '/spells'
      path: '/spells'
      fullPath: '/spells'
      preLoaderRoute: typeof SpellsLazyImport
      parentRoute: typeof rootRoute
    }
    '/thanks': {
      id: '/thanks'
      path: '/thanks'
      fullPath: '/thanks'
      preLoaderRoute: typeof ThanksLazyImport
      parentRoute: typeof rootRoute
    }
    '/tickets': {
      id: '/tickets'
      path: '/tickets'
      fullPath: '/tickets'
      preLoaderRoute: typeof TicketsLazyImport
      parentRoute: typeof rootRoute
    }
    '/traits': {
      id: '/traits'
      path: '/traits'
      fullPath: '/traits'
      preLoaderRoute: typeof TraitsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/attacks': typeof AttacksLazyRoute
  '/character': typeof CharacterLazyRoute
  '/chat': typeof ChatLazyRoute
  '/inspiration': typeof InspirationLazyRoute
  '/notes': typeof NotesLazyRoute
  '/profile': typeof ProfileLazyRoute
  '/signup': typeof SignupLazyRoute
  '/spells': typeof SpellsLazyRoute
  '/thanks': typeof ThanksLazyRoute
  '/tickets': typeof TicketsLazyRoute
  '/traits': typeof TraitsLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/attacks': typeof AttacksLazyRoute
  '/character': typeof CharacterLazyRoute
  '/chat': typeof ChatLazyRoute
  '/inspiration': typeof InspirationLazyRoute
  '/notes': typeof NotesLazyRoute
  '/profile': typeof ProfileLazyRoute
  '/signup': typeof SignupLazyRoute
  '/spells': typeof SpellsLazyRoute
  '/thanks': typeof ThanksLazyRoute
  '/tickets': typeof TicketsLazyRoute
  '/traits': typeof TraitsLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/attacks': typeof AttacksLazyRoute
  '/character': typeof CharacterLazyRoute
  '/chat': typeof ChatLazyRoute
  '/inspiration': typeof InspirationLazyRoute
  '/notes': typeof NotesLazyRoute
  '/profile': typeof ProfileLazyRoute
  '/signup': typeof SignupLazyRoute
  '/spells': typeof SpellsLazyRoute
  '/thanks': typeof ThanksLazyRoute
  '/tickets': typeof TicketsLazyRoute
  '/traits': typeof TraitsLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/attacks'
    | '/character'
    | '/chat'
    | '/inspiration'
    | '/notes'
    | '/profile'
    | '/signup'
    | '/spells'
    | '/thanks'
    | '/tickets'
    | '/traits'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/attacks'
    | '/character'
    | '/chat'
    | '/inspiration'
    | '/notes'
    | '/profile'
    | '/signup'
    | '/spells'
    | '/thanks'
    | '/tickets'
    | '/traits'
  id:
    | '__root__'
    | '/'
    | '/attacks'
    | '/character'
    | '/chat'
    | '/inspiration'
    | '/notes'
    | '/profile'
    | '/signup'
    | '/spells'
    | '/thanks'
    | '/tickets'
    | '/traits'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AttacksLazyRoute: typeof AttacksLazyRoute
  CharacterLazyRoute: typeof CharacterLazyRoute
  ChatLazyRoute: typeof ChatLazyRoute
  InspirationLazyRoute: typeof InspirationLazyRoute
  NotesLazyRoute: typeof NotesLazyRoute
  ProfileLazyRoute: typeof ProfileLazyRoute
  SignupLazyRoute: typeof SignupLazyRoute
  SpellsLazyRoute: typeof SpellsLazyRoute
  ThanksLazyRoute: typeof ThanksLazyRoute
  TicketsLazyRoute: typeof TicketsLazyRoute
  TraitsLazyRoute: typeof TraitsLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AttacksLazyRoute: AttacksLazyRoute,
  CharacterLazyRoute: CharacterLazyRoute,
  ChatLazyRoute: ChatLazyRoute,
  InspirationLazyRoute: InspirationLazyRoute,
  NotesLazyRoute: NotesLazyRoute,
  ProfileLazyRoute: ProfileLazyRoute,
  SignupLazyRoute: SignupLazyRoute,
  SpellsLazyRoute: SpellsLazyRoute,
  ThanksLazyRoute: ThanksLazyRoute,
  TicketsLazyRoute: TicketsLazyRoute,
  TraitsLazyRoute: TraitsLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/attacks",
        "/character",
        "/chat",
        "/inspiration",
        "/notes",
        "/profile",
        "/signup",
        "/spells",
        "/thanks",
        "/tickets",
        "/traits"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/attacks": {
      "filePath": "attacks.lazy.tsx"
    },
    "/character": {
      "filePath": "character.lazy.tsx"
    },
    "/chat": {
      "filePath": "chat.lazy.tsx"
    },
    "/inspiration": {
      "filePath": "inspiration.lazy.tsx"
    },
    "/notes": {
      "filePath": "notes.lazy.tsx"
    },
    "/profile": {
      "filePath": "profile.lazy.tsx"
    },
    "/signup": {
      "filePath": "signup.lazy.tsx"
    },
    "/spells": {
      "filePath": "spells.lazy.tsx"
    },
    "/thanks": {
      "filePath": "thanks.lazy.tsx"
    },
    "/tickets": {
      "filePath": "tickets.lazy.tsx"
    },
    "/traits": {
      "filePath": "traits.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
