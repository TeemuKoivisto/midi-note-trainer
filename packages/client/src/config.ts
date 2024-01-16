const getEnv = (env: string | undefined) => {
  if (!env) {
    throw new Error('Undefined environment variable!')
  }
  return env
}

export const DEV = import.meta.env.DEV
// More about SvelteKit's default env variables https://vitejs.dev/guide/env-and-mode.html
// TODO rather than importing DEV everywhere, create logger that checks for DEV
// which also would allow for event logging like in Redux
