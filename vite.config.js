import { defineConfig, loadEnv  } from 'vite'
import dotEnv from 'dotenv'
import react from '@vitejs/plugin-react'

dotEnv.config()
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) =>{
  const env = loadEnv(mode, process.cwd(), '')
  return {

    plugins: [react()],
    
    server:{
      hmr:{
        protocol:'ws',
        host:'localhost',
      },
      port: env.VITE_PORT
    },
    test: {
      globals: true,
      environment: 'jsdom',
    }
  }
})

