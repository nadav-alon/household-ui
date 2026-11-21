/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [preact(), Icons({ compiler: 'jsx', jsx: 'preact', scale: 1 })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
