import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { flatRoutes } from 'remix-flat-routes'
import { remixRoutes } from 'remix-routes/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals({ nativeFetch: true })

export default defineConfig({
  plugins: [
    remix({
      routes: (defineRoutes) => flatRoutes('routes', defineRoutes),
      future: { unstable_singleFetch: true },
    }),
    remixRoutes(),
    tsconfigPaths(),
  ],
  test: {
    exclude: ['projects', 'node_modules'],
  },
})
