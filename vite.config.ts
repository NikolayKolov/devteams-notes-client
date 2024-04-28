import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // The Node.js backend will run on the same server, but a different port
    server: {
        proxy: {
            "/api": "http://localhost:5000",
        }
    }
});
