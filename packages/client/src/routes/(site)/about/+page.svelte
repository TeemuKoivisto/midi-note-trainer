<script lang="ts">
  import NavBar from '$components/NavBar.svelte'
</script>

<NavBar />

<h1
  class="mb-8 mt-12 flex items-center justify-between px-4 text-4xl font-bold tracking-tight md:mt-16 md:text-5xl"
>
  About
</h1>

<article class="px-4">
  <p>
    Hi, I'm Teemu Koivisto — the author of this app — who found reading music overly difficult so as
    any software engineer would, I decided to write an app to help me. Hopefully it is of use to you
    as well.
  </p>
  <p class="mt-4">
    This is an open-source project utilizing many other open-source libraries such as
    <a class="font-bold hover:underline" href="https://github.com/vexflow/vexflow">vexflow</a>,
    <a class="font-bold hover:underline" href="https://github.com/danigb/smplr">smplr</a> and
    <a class="font-bold hover:underline" href="https://svelte.dev/">Svelte</a> to name a few. If you
    have suggestions or general feedback feel free to submit an issue to the
    <a class="font-bold hover:underline" href="https://github.com/TeemuKoivisto/midi-note-trainer">
      GitHub
    </a>
    repository or send me an email at
    <span class="italic">teemukoivisto.xyz ~АТ~ gmail.com</span>
  </p>
  <p class="mt-4">
    Check out my blog at <a class="font-bold hover:underline" href="https://teemukoivisto.xyz/"
      >teemukoivisto.xyz</a
    >
  </p>
</article>

<style lang="postcss">
</style>
