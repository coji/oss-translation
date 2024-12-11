import { reactRouter } from '@react-router/dev/vite'
import { safeRoutes } from 'safe-routes/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  optimizeDeps: { exclude: ['projects'] },
  plugins: [reactRouter(), safeRoutes(), tsconfigPaths()],
})
