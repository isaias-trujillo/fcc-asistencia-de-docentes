import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), nodePolyfills()],
  base: '/asistencia-de-docentes-de-posgrado',
  build:{
    outDir: "asistencia-de-docentes-de-posgrado",
  }
})
