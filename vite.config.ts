import { vitePlugin as remix } from '@remix-run/dev'
import { flatRoutes } from 'remix-flat-routes'
import { remixRoutes } from 'remix-routes/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults } from 'vitest/config'

declare module '@remix-run/server-runtime' {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true
  }
}

export default defineConfig({
  optimizeDeps: {
    exclude: ['projects'],
  },
  plugins: [
    remix({
      routes: (defineRoutes) => flatRoutes('routes', defineRoutes),
      future: {
        v3_fetcherPersist: true,
        v3_throwAbortReason: true,
        v3_relativeSplatPath: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        unstable_optimizeDeps: true,
      },
    }),
    remixRoutes(),
    tsconfigPaths(),
  ],
  test: {
    exclude: [...configDefaults.exclude, 'projects'],
  },
})
