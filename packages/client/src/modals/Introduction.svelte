<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import x from '@iconify-icons/feather/x'

  import type { ModalParams } from '$stores/modal'
  import { onMount } from 'svelte'

  export let params: ModalParams['introduction']
  export let hideModal: () => void = () => undefined

  let originalFocusedEl: HTMLElement
  let closeButtonEl: HTMLElement

  onMount(() => {
    // Hacky focus capture into modal and returning it back to the button when the modal is closed
    if (document.activeElement instanceof HTMLElement) {
      originalFocusedEl = document.activeElement
    }
    closeButtonEl.focus()
    return () => {
      originalFocusedEl.focus()
    }
  })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      hideModal()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div bind:this={closeButtonEl} tabindex="-1" class="flex flex-col relative focus:outline-none">
  <div class="absolute op-0 right-0">
    <button
      class="flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"
      on:click={hideModal}
    >
      <Icon icon={x} width={24} />
    </button>
  </div>
  <h2 class="pl-1.5 mt-4 mb-2 text-5xl font-semibold text-black">Introduction</h2>
  <article class="w-full p-2 pb-4">
    <p>Greetings! 👋</p>
    <p>
      This is a tiny app that I made to help myself and hopefully others to learn music notation. I
      strongly think that you have to really drill them down until reading music becomes as easy as
      reading a language.
    </p>
    <p>
      To get the full benefits of this app, I advise you to connect your MIDI keyboard to your
      computer. For most modern keyboards, you can do this directly with USB but with older models
      you need an audio interface to work as an adapter. You can also use your computer keyboard but
      it might not improve your piano playing as much.
    </p>
    <h3>I/O</h3>
    <p>
      Under the <b>I/O Settings</b> you find controls to connect your MIDI keyboard which prompts for
      Web MIDI permissions. You can also fix your velocity incase your keyboard plays quietly (like mine).
      The default velocity without MIDI keyboard is 80.
    </p>
    <p>
      Enabling <b>Hotkeys</b> maps your keyboard to piano keyboard following similar format as in
      Ableton. <b>Auto-octave</b> automatically appends an octave as mapped in the hotkey map,
      pressing <i>Shift</i> at the same time increments it by 1. Having both enabled allows you to
      play notes with single keypresses.
      <b>Fade timeout</b> is how long in milliseconds notes appear in score once played. It does not
      effect the suspend of the piano as that would require coding a more sophisticated MIDI piano engine.
    </p>
    <p>
      With <b>Set Hotkeys</b> you can visualize and customize the mapping. I explored keyboard
      layouts in different locales and noticed that my layout (ISO Finland) is quite rare so I
      wanted to make sure the hotkeys would work for others too. I have however fixed the layout to
      14-14-13-13 key ISO which has meant cutting keys from other layouts or leaving them blank. To
      detect the pressed keys I am using this rather curious "code" property in
      <code>KeyboardEvent</code> which may not work for everyone.
    </p>
    <p>
      Incase it doesn't, tick the <b>Custom</b> option and map the keys manually. Press the row you
      want to set and then press the keys from your keyboard. If you want to skip a key, press
      <code>Space</code>. You can also use two rows for the keys which enables quite impressive 4
      octave range. Clicking a reload button resets the settings to the default values.
    </p>
    <h3>Scales</h3>
    <p>
      I went quite deep while coding this app to learn as much about music theory as possible 😵‍💫.
      This meant figuring out how to programmatically compute both the scales and chords without
      resolving to crude heuristics. Incase you find any silly mistakes, please report to the GitHub
      repository or send me email directly.
    </p>
    <p>
      The most confusing part has been perhaps how the used accidentals are decided. I suppose in
      most cases you use either all flats or sharps but since sometimes a note is specified as
      either flat or sharp interval, I ultimately resolve to use its accidental. I'm not sure if
      this is always the correct way but it was the most programming-friendly.
    </p>
    <p>
      You can input a <b>Key</b> and visualize the notes in every scale. I am also displaying the
      <i>diatonic triads</i>
      for each scale degree and their respective chords. This "diatonic triads" is rather odd subject
      as there is not even a Wikipedia article about it and it's only briefly mentioned in
      <a
        href="https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns"
        target="_blank">Wikibooks.</a
      >
      How I have come to understand it is, that for every note in the scale you pick the 2nd and 4th
      next notes of the scale going up. This is the diatonic triad for that scale-degree. However, this
      falls apart quickly outside the standard 7 modes as the triads might not contain any thirds or
      fifths. Then you must manually check all the available options which might lead to finding multiple
      valid chords.
    </p>
    <p>
      How I approach this is somewhat unscientific; I iterate every scale note and then map all the
      other notes as its intervals. Then I use
      major-minor-diminished-augmented-7th-6th-suspended-5th order to decide which triad to pick as
      this seems to follow the convention the best covering all scales currently listed. <i
        >However,</i
      >
      in some weird cases, the best fit I find is a <code>sus</code> chord with no fifth in which case
      I add one. Which makes the triad not diatonic so uhh... I'd love to hear opinions about this.
    </p>
    <p>
      Clicking the notes or the triads will play them in the chosen key (or whatever is used in
      score). I am adding the 8th interval for every scale since it'll sound awfully incomplete
      otherwise.
    </p>
    <h3>Chords</h3>
    <p>
      Similar to scales, you can input <b>Key</b>, <b>Scale</b> as well as root <b>Note</b> and have
      them shown for every chord. Key and scale only changes the notation of the accidentals. You can
      also select/unselect these chords to be used with the Write/Play Chords games. There is some quick-use
      buttons to select basic major/minor, seventh and all chords.
    </p>
    <h3>Score</h3>
    <p>
      You can here set the played range of the keyboard notes and what's used in the games. I have
      only used C as the start/end note so there might be bugs lurking there. The scale and key
      determines the notation of the notes as well as the key signature.
    </p>
    <p>
      The topic of the key signature (the added accidentals next to the clef) is rather ambiguous
      outside of major/minor distinction so I've tried to come up with an easy compromise. The
      convention seems to be to use the closest major/minor approximate of the scale and then add
      the accidentals for the rest.
    </p>
    <p>
      Programmatically speaking, it's much easier to consider key signature's function only as a
      time and space saver to declutter the score from accidentals and it's how I've approached it.
      Although the order of the added accidentals stays always the same:
      <b>B♭, E♭, A♭, D♭, G♭, C♭, F♭</b>
      for flats and
      <b>F♯, C♯, G♯, D♯, A♯, E♯, B♯</b> for sharps. So if there were Bb, Eb, Db and Gb flats in the scale,
      the key signature would only include Bb, Eb and then use accidentals for the rest. I could add
      5 flats to the signature and then naturalize the As but that starts to get convoluted.
    </p>
    <h3>Play</h3>
    <p>
      This is the meat of the app. There's a list of games you can play to practise your skills with
      the intention of adding a few more in the years to come. I hope they are quite
      self-explanatory as there's no instructions how to play them. <b>Guess Pitches</b> is relatively
      useless for those who have no chance of acquiring perfect pitch but it's fun to try once in a while.
    </p>
    <p>
      In the base settings, I am by default enabling <b>Duplicates</b> and <b>Autoplay</b>
      as that seemed the most optimal for me. I'm using true-random sampling so <b>Duplicates</b>
      might produce rather awkward sequential notes/chords which I might get around fixing at some point.
    </p>
    <p>
      One big missing feature from the games are the inversions of chords as well missing notes.
      This is after all how majority of chords are played. But since it's rather big haven't had
      time to implement it. Also playing the given scale-degree diatonic triad would be another. As
      well as recognizing the played scales. Oh well. Pull requests are welcome!
    </p>
    <p>
      As an end note, I hope this app will be helpful in learning music notation! I found multiple
      existing apps but I thought they were a little too complicated and slow to use. I can
      confidently say that I've noticed a significant improvement myself playing these exercises and
      now as I revisit my old sheets it doesn't require pulling (as much) hair to decipher them 😄.
    </p>
  </article>
</div>

<style lang="scss">
  article {
    a {
      font-weight: 600;
      @apply underline text-[#0000ff] break-all;
    }
    hr {
      @apply my-16 border-gray-900;
    }
    p {
      @apply my-4 pl-[2px];
    }
    & > h1 {
      @apply font-sans mt-10 mb-6 text-5xl tracking-tight;
    }
    & > h2 {
      @apply font-sans mt-10 mb-6 text-4xl tracking-tight;
    }
    & > h3 {
      @apply font-sans mt-10 mb-6 text-3xl tracking-tight pl-[1px];
    }
    pre {
      // padding-left: 6px;
      @apply my-4;
      code {
        @apply p-4 block bg-white rounded overflow-y-auto;
      }
    }
  }
</style>
