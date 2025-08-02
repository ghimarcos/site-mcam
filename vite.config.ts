import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/site-mcam/', // Adicione esta linha com o nome do seu repositório
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})