import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");
require("dotenv").config();

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "../backend/public/dist",
    emptyOutDir: true, // also necessary
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    productionSourceMap: false,
    configureWebpack: {
      performance: {
        hints: process.env.NODE_ENV === "production" ? "warning" : false,
      },
    },
  },
  server: {
    /*
    host: process.env.HOSTNAME,
    port: process.env.PORT || 3001,
    proxy: {
      "/api": {
        target: `http://${process.env.BE_HOSTNAME}:${process.env.BE_PORT}/`,
        changeOrigin: true,
      },
    },*/
  },
});
//module.exports = {};
