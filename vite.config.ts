import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const aliasPrefix = (subdir) => path.resolve(__dirname, subdir);

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@slices": aliasPrefix("src/store/slices"),
      "@shared": aliasPrefix("src/shared"),
    },
  },
});
