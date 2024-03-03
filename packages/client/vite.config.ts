/// <reference types="vitest" />

import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.dict'],
  server: {},
  resolve: {
    alias: {
      $api: resolve('./src/api'),
      $components: resolve('./src/components'),
      $config: resolve('./src/config'),
      $elements: resolve('./src/elements'),
      $games: resolve('./src/games'),
      $stores: resolve('./src/stores'),
      $utils: resolve('./src/utils')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('svelte')) {
              return 'vendor_svelte'
            } else if (id.includes('vexflow')) {
              return 'vendor_vexflow'
            }
            return 'vendor'
          }
        }
      }
    }
  },
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    cache: false
  }
})
