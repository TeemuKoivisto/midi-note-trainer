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
    // Lock scrolling of viewport behind the modal
    document.querySelector('html')?.classList.add('scroll-lock')
    return () => {
      originalFocusedEl.focus()
      document.querySelector('html')?.classList.remove('scroll-lock')
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
  <div class="absolute -top-2 -right-2">
    <button
      class="flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"
      on:click={hideModal}
    >
      <Icon icon={x} width={24} />
    </button>
  </div>
  <h2 class="pl-1.5 mt-4 mb-2 text-4xl sm:text-5xl font-semibold text-black">Introduction</h2>
  <article class="w-full p-2 pb-4">
    <p>Greetings! 👋</p>
    <p>
      This is a tiny app that I made to help myself and hopefully others to learn music notation. I
      strongly think that you have to really drill them down until reading music becomes as easy as
      reading a language.
    </p>
    <p>
      To get the full benefits of this app, I advise you to connect your MIDI keyboard to your
      computer or phone. For most modern keyboards, you can do this directly with USB but with older
      models you need an audio interface to serve as an adapter. You can also use a virtual piano or
      computer keyboard but it might not improve your piano playing as much.
    </p>
    <h3>I/O</h3>
    <p>
      Under the <b>I/O Settings</b> you find controls to connect your MIDI keyboard which prompts for
      Web MIDI permissions. You can also fix your velocity incase your keyboard plays quietly (like mine).
      The default velocity without MIDI keyboard is 80.
    </p>
    <p>
      Under <b>Virtual piano</b> you can toggle the crude virtual piano incase you are using a tablet
      or phone. It's not that sophisticated and I'd advice you to use at least laptop keyboard if possible
      for better ergonomics.
    </p>
    <p>
      Enabling <b>Hotkeys</b> maps your keyboard to piano keyboard following similar format as in
      Ableton. <b>Auto-octave</b> automatically appends an octave as mapped in the hotkey map,
      pressing <i>Shift</i> at the same time increments it by 1. Having both enabled allows you to
      play notes instantly.
      <b>Fade timeout</b> is how long in milliseconds notes appear in score once played but it does not
      effect the suspend of the piano.
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
      <code>Space</code>. You can also use two rows for the keys which enables quite impressive 3
      octave range. Clicking a reload button resets the settings to the default values.
    </p>
    <h3>Scales</h3>
    <p>
      I went quite deep while coding this app to learn as much about music theory as possible 😵‍💫.
      This meant figuring out how to programmatically compute both the scales and chords without
      resolving to crude heuristics. Incase you find any silly mistakes, please report to the
      <a
        class="font-bold hover:underline"
        href="https://github.com/TeemuKoivisto/midi-note-trainer"
      >
        GitHub
      </a>
      GitHub repository or send me email directly (see About).
    </p>
    <p>
      The most confusing part has been perhaps how the used accidentals are decided. I suppose in
      most cases you use either all flats or sharps but since sometimes a note is specified as
      either flat or sharp interval, I ultimately resolve to use its accidental. I'm not sure if
      this is always the correct way but it was the most programming-friendly.
    </p>
    <p>
      You can input a <b>Key</b> and visualize the notes in every scale. I am also displaying the
      <i>scale degree trichords</i> which is rather odd subject that is described in
      <a
        href="https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns"
        target="_blank">Wikibooks</a
      > with rather loose definitions. If you are not interested in theory, feel free to skip my meandering
      explanations.
    </p>
    <p>
      The principle of scale degree triad/trichord is sound with all the standard 7 modes: for every
      note in the scale you pick the 2nd and 4th next notes of the scale going up — that's a <a
        href="https://en.wikipedia.org/wiki/Triad_(music)">diatonic triad</a
      >
      which represents either a <code>major/minor/augmented/diminished</code> chord. However,
      outside the 7 modes this falls apart quickly as there might not be any diatonically viable
      triads. I suppose you
      <i>could</i>
      just construct a triad without following diatonicy but I think that loses any nuance of the scale.
    </p>
    <p>
      How I approached this is somewhat unscientific; I iterate every scale note and then map all
      the other notes as its intervals. Then I use
      major-minor-diminished-augmented-7th-6th-suspended-5th order to find the best suited <a
        href="https://en.wikipedia.org/wiki/Trichord">trichord</a
      >
      to represent that scale degree as they seem to cover all the scales currently listed.
    </p>
    <p>
      <i>However,</i>
      this approach has some problems. For example, 7th or 6th chord contains a major chord thus would
      already be mapped as major — the reason they aren't is because they are missing a third. And likewise
      those already mapped as major don't indicate if they can be extended diatonically further. For
      some notes I only found a major second or perfect fourth suggesting a <code>sus</code>
      chord but then there's no fifth which leaves basically no options left. In those cases, I add a
      fifth and call it a day but that makes the trichord non-diatonic so uhh... Any suggestions are
      welcome.
    </p>
    <p>
      Clicking the notes or the trichords will play them in the chosen key (or whatever is used in
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
      You can here set the played range of the keyboard notes and what's used in the games. The
      arrow buttons shift the start or end of the range by 1 octave. The scale and key determines
      the notation of the notes as well as the key signature.
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
      In the base settings, I'm by default enabling <b>Duplicates</b> and <b>Autoplay</b>
      as that seemed the most optimal for me. I am using true-random sampling so <b>Duplicates</b>
      might produce rather awkward sequential notes/chords which I might get around fixing at some point.
    </p>
    <p>
      One big missing feature from the games are the inversions of chords as well as missing notes.
      This is after all how majority of chords are played. Maybe one day I'll find time for it. Also
      playing the given scale degree trichord would be another. As well as recognizing the played
      scales. Oh well. Pull requests are welcome!
    </p>
    <p>
      As an end note, I hope this app will be helpful in teaching you music notation! I found
      multiple existing apps but I thought they were a little too complicated and slow to use. I can
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
    & > h3 {
      @apply font-sans mt-10 mb-6 text-2xl sm:text-3xl tracking-tight pl-[1px];
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
