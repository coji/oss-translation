import { Link, Outlet } from 'react-router'
import type { Route } from './+types/_layout'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function LayoutPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] gap-2 bg-slate-200">
      <header className="container bg-card px-4 py-2 shadow-sm">
        <h1 className="text-xl">
          <Link to="/">OSS Translation</Link>
        </h1>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
