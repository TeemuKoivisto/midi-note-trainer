<script>
  import { MetaTags } from 'svelte-meta-tags'

  import '../../tailwind.css'
</script>

<MetaTags
  title="MIDI Note Trainer"
  description="Practise music notation, scales and chords using MIDI directly from browser."
  canonical="https://www.canonical.ie/"
  openGraph={{
    url: 'https://midi-note-trainer.teemukoivisto.xyz',
    title: 'MIDI Note Trainer',
    description: 'Practise music notation, scales and chords using MIDI directly from browser.',
    images: []
  }}
  twitter={{
    title: 'MIDI Note Trainer',
    description: 'Practise music notation, scales and chords using MIDI directly from browser.'
  }}
/>
<div class="flex-col items-center justify-center">
  <main class="flex-col items-center justify-center h-full min-h-screen max-w-[764px] mx-[auto]">
    <slot />
  </main>
</div>
