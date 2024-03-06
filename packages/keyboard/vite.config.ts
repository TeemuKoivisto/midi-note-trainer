/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json' assert { type: 'json' }

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve('src/index.ts'),
      fileName: 'index',
      formats: ['es']
    },
    minify: false
  },
  plugins: [dts(), tsconfigPaths()],
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    cache: false
  }
})
