import adapterStatic from '@sveltejs/adapter-static'
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    // postcss: {
    //   // @TODO you are not supposed to need both configFilePath & plugins but the intellisense doesn't
    //   // work with configFilePath and providing plugins directly doesn't load Tailwind so...
    //   configFilePath: resolve('postcss.config.js'),
    //   plugins: [tailwindcss, autoprefixer, nested],
    // },
  }),

  kit: {
    files: {
      routes: './src/routes',
      lib: './src/lib'
    },
    adapter: adapterStatic({
      pages: 'build',
      assets: 'build',
      fallback: '404.html'
    }),
    alias: {
      $api: 'src/api',
      $components: 'src/components',
      $config: 'src/config',
      $elements: 'src/elements',
      $hooks: 'src/hooks',
      $lib: 'src/lib',
      $modals: 'src/modals',
      $stores: 'src/stores',
      $utils: 'src/utils'
    }
  }
}
