import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.dict'],
  server: {},
  base: process.env.DEPLOY_TO_GH ? '/midi-music-notation-trainer/' : '',
  resolve: {
    alias: {
      $api: resolve('./src/api'),
      $components: resolve('./src/components'),
      $config: resolve('./src/config'),
      $elements: resolve('./src/elements'),
      $stores: resolve('./src/stores'),
      $utils: resolve('./src/utils')
    }
  }
})
