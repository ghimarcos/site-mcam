import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',  // Define a raiz do projeto como o diretório atual
  base: '/',  // URL base para os assets
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
    open: true  // Abre o navegador automaticamente
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')  // Permite usar @ como alias para a pasta src
    }
  }
})