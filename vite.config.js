import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'ACFEditorJS',
      formats: ['iife'],
      fileName: 'acf-editorjs'
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['jquery'],
      output: {
        globals: {
          jquery: 'jQuery'
        }
      }
    },
    minify: true,
    sourcemap: false
  }
});