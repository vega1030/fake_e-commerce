import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public',
    build: {
        outDir: '../dist',
        target: 'esnext', // Usa ESNext para soporte de Top-level await
        rollupOptions: {
            input: {
                main: 'public/index.html'
            }
        }
    }
});
