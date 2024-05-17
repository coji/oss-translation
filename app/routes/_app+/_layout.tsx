import type { MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function LayoutPage() {
  return (
    <div className="grid-rows-[auto_1fr grid grid-cols-1">
      <header>
        <h1>OSS Translation</h1>
      </header>
      <main>
        hoge
        <Outlet />
      </main>
    </div>
  )
}
