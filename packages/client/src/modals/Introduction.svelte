<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import x from '@iconify-icons/feather/x'

  import type { ModalParams } from '$stores/modal'

  export let params: ModalParams['introduction']
  export let hideModal: () => void = () => undefined
</script>

<div class="absolute top-[1rem] right-[1rem]">
  <button
    class="flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"
    on:click={hideModal}
  >
    <Icon icon={x} width={24} />
  </button>
</div>

<div class="mx-2 mt-2 mb-6 flex flex-col">
  <h2 class="text-5xl mt-6 mb-4 font-semibold text-black">Introduction</h2>
  <article class="w-full mt-2">
    <p>Greetings! 👋</p>
    <p>
      This is a tiny app that I made to help myself and hopefully others to learn music notation. In
      my opinion, you have to really drill them down until reading music becomes as easy as reading
      a language.
    </p>
    <p>
      To get the full benefits of this app, I advise you to connect your MIDI keyboard to your
      computer. For most modern keyboards, you can do this directly with USB. With older models you
      need an audio interface to work as an adapter. You can also use your computer keyboard but it
      might not improve your piano playing as much.
    </p>
    <h3>I/O</h3>
    <p>
      Under the <b>I/O Settings</b> you find controls to connect your MIDI keyboard which prompts
      for Web MIDI permissions. You can also fix your velocity incase your keyboard plays quietly
      (like mine). The default velocity without MIDI keyboard is 80. Enabling <b>Hotkeys</b> maps
      your keyboard to piano keyboard following similar format as in Ableton. With
      <b>Auto-octave</b>
      also enabled you can play notes with single keypresses. <b>Fade timeout</b> is how long in milliseconds
      notes appear in score once played. It does not effect the suspend of the piano as that would require
      coding a more sophisticated MIDI piano engine.
    </p>
    <p>
      With <b>Set Hotkeys</b> you can visualize and customize the mapping. I explored keyboard
      layouts in different locales and noticed that my layout (ISO Finland) is quite rare so I
      wanted to make sure the hotkeys would work for others too. There is a rather curious "code"
      property in
      <code>KeyboardEvent</code> that I'm utilizing to identify the pressed keys which may not work for
      everyone.
    </p>
    <p>
      Incase it doesn't, tick the <b>Custom</b> option and map the keys manually. Press the row you want
      to set and then every key in that row. If you want to skip a key, press space. You can also enable
      the use of two rows for piano keys. You can reset your settings from the reload icon.
    </p>
    <h3>Scales</h3>
    <p>
      I went quite deep while coding this app to learn as much about music theory as possible 😅.
      This meant figuring out how to programmatically compute both the scales and chords without
      resolving to crude heuristics. Incase you find any silly mistakes, please report to the GitHub
      repository or send me email directly.
    </p>
    <p>
      The most confusing part has been perhaps how the used accidentals are decided. I suppose in
      most cases you use either all flats or sharps but since some times a note is specified as
      either flat or sharp interval, I ultimately resolve to use its accidental. I'm not if this is
      always the correct way but it was the most programming-friendly.
    </p>
    <p>
      You can input a <b>Key</b> and visualize the notes in every scale. I am also displaying the
      <i>diatonic triads</i>
      for each scale degree and their respective chords. This is a rather curious since there isn't even
      a Wikipedia article on this subject, and only briefly mentioned in
      <a
        href="https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns"
        target="_blank">Wikibooks.</a
      >
      How I have come to understand it is, that for every note in the scale you pick the 2nd and 4th
      next notes of the scale going up. This is the diatonic triad for that scale-degree. However, this
      falls apart quickly outside the standard 7 modes as you might not find any suitable chord with
      zero thirds or fifths. Sometimes you want to pick the next note or the 3rd which leads to multiple
      valid chords.
    </p>
    <p>
      How I approach this is somewhat unscientific; I construct all the intervals for every note and
      then pick the triad in major-minor-diminished-augmented-7th-6th-suspended-5th order. For some
      weird cases, there aren't even suspended chords in which case I am adding a perfect 5th to the
      triad even though it's not diatonic. Suggestions are welcome how to improve this.
    </p>
    <!-- <p>
      Diatonic triads For each scale, I am showing the notes but also the most fitting diatonic
      triads I could find. Now the displayed triads are for some scales quite questionable and they
      might not even be diatonic since I might had had to add a missing perfect fifth for Asus
      triad. However, for most modes these are the ones you see used in music notation. Basically
      what the diatonic triads are, is you pick a scale note and press the second and fourth note
      going up the scale. Whatever chord that is, is the diatonic triad for that note in that scale.
      However, when there's less than 7 notes in a scale things get weird as the played notes might
      not be really chords of any kind. Suggestions to improve this are welcome!
    </p> -->
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
      only used C as the starting/ending note so there might be bugs lurking there. The scale and
      key determines the notation of the notes as well as the key signature.
    </p>
    <p>
      Outside of major/minor scale, the added accidentals to the key-signature is somewhat
      ambiguous. The convention seems to be to use the closest major/minor approximate of the scale
      and then add the accidentals for the rest.
    </p>
    <p>
      Programmatically speaking, it's much easier to consider key signature's function only as a
      time and space saver to declutter the score from accidentals and is how I approach this. The
      order of the added flats and sharps stays however the same. <b
        >B♭, 'E♭, 'A♭, 'D♭, 'G♭, 'C♭, 'F♭</b
      >
      for flats and
      <b>F♯, 'C♯, 'G♯, 'D♯, 'A♯, 'E♯, 'B♯</b> for sharps. So if there were Bb, Eb, Db and Gb flats in
      the scale, the key signature would only include Bb, Eb and then use accidentals for the rest. I
      could add 5 flats to the signature and then naturalize the As but that seems a bit too much.
    </p>
    <h3>Play</h3>
    <p>
      Here is the meat of this app. I've added a few games to practise your skills but I could add a
      few more. Most are quite self-explanatory. The <b>Guess Pitches</b> game is relatively useless
      for those who have missed the boat for acquiring perfect pitch.
    </p>
    <p>
      In the base settings, I am by default enabling <b>Duplicates</b> as well as <b>Autoplay</b>.
      Since the sampling is true-random, there might be same notes/chords in row which kinda sucks
      but disabling duplicates should help.
    </p>
    <p>
      One big missing feature are the different inversions of chords and/or removed notes. This is
      how the majority of chords are played after all. It is, however, a rather big feature to build
      which is why it doesn't exist. Also playing the given scale-degree triad would be another. As
      well as recognizing the played scales. Oh well. Pull requests are welcome!
    </p>
    <p>
      All in all, I hope this app will be helpful in learning music notation! I saw multiple
      existing apps but I thought they were a little too complicated and slow to use. I myself can
      happily say that I've noticed a significant improvement and I can revisit my old sheets
      without having to pull my hair deciphering them 😄.
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
