import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/bingordono-vite/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        wordlist: resolve(__dirname, 'wordlist.html'),
      },
    },
  },
})
