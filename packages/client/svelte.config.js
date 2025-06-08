import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true
    })
  ],

  kit: {
    files: {
      routes: './src/routes',
      lib: './src/lib'
    },
    paths: {
      base: process.env.VITE_DEPLOY_TO_GH ? '/midi-note-trainer' : ''
    },
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: '200.html'
    }),
    serviceWorker: process.env.NODE_ENV === 'development' ? {
      register: false
    } : undefined
  }
}
