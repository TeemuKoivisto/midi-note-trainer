import{S as O,i as H,s as B,P as R,e as b,a as M,b as q,g,h as w,d as z,j as m,f as C,x as P,k as p,l as S,n as y,m as D,y as A,W as X,t as v,q as _,r as x,X as Z,A as J,N as Q,B as L,K as U,C as V,R as W,O as Y,Y as F,Z as T,_ as G,$ as K,c as ee,u as te,o as se,p as ae}from"../chunks/vendor_svelte.0d2c79a3.js";import{b as ie}from"../chunks/vendor.e9b0235c.js";import{o as oe,m as ne,a as le}from"../chunks/modal.381e9f88.js";/* empty css                         */const re=!0,we=Object.freeze(Object.defineProperty({__proto__:null,prerender:re},Symbol.toStringTag,{value:"Module"}));function ce(l){let t,o,e,i,a,s,n="Introduction",u,c,I=`<p class="svelte-cjiik9">Greetings! 👋</p> <p class="svelte-cjiik9">This is a tiny app that I made to help myself and hopefully others to learn music notation. I
      strongly think that you have to really drill them down until reading music becomes as easy as
      reading a language.</p> <p class="svelte-cjiik9">To get the full benefits of this app, I advise you to connect your MIDI keyboard to your
      computer. For most modern keyboards, you can do this directly with USB but with older models
      you need an audio interface to work as an adapter. You can also use your computer keyboard but
      it might not improve your piano playing as much.</p> <h3 class="svelte-cjiik9">I/O</h3> <p class="svelte-cjiik9">Under the <b>I/O Settings</b> you find controls to connect your MIDI keyboard which prompts for
      Web MIDI permissions. You can also fix your velocity incase your keyboard plays quietly (like mine).
      The default velocity without MIDI keyboard is 80.</p> <p class="svelte-cjiik9">Enabling <b>Hotkeys</b> maps your keyboard to piano keyboard following similar format as in
      Ableton. <b>Auto-octave</b> automatically appends an octave as mapped in the hotkey map,
      pressing <i>Shift</i> at the same time increments it by 1. Having both enabled allows you to
      play notes with single keypresses.
      <b>Fade timeout</b> is how long in milliseconds notes appear in score once played. It does not
      effect the suspend of the piano as that would require coding a more sophisticated MIDI piano engine.</p> <p class="svelte-cjiik9">With <b>Set Hotkeys</b> you can visualize and customize the mapping. I explored keyboard
      layouts in different locales and noticed that my layout (ISO Finland) is quite rare so I
      wanted to make sure the hotkeys would work for others too. I have however fixed the layout to
      14-14-13-13 key ISO which has meant cutting keys from other layouts or leaving them blank. To
      detect the pressed keys I am using this rather curious &quot;code&quot; property in
      <code class="svelte-cjiik9">KeyboardEvent</code> which may not work for everyone.</p> <p class="svelte-cjiik9">Incase it doesn&#39;t, tick the <b>Custom</b> option and map the keys manually. Press the row you
      want to set and then press the keys from your keyboard. If you want to skip a key, press
      <code class="svelte-cjiik9">Space</code>. You can also use two rows for the keys which enables quite impressive 4
      octave range. Clicking a reload button resets the settings to the default values.</p> <h3 class="svelte-cjiik9">Scales</h3> <p class="svelte-cjiik9">I went quite deep while coding this app to learn as much about music theory as possible 😵‍💫.
      This meant figuring out how to programmatically compute both the scales and chords without
      resolving to crude heuristics. Incase you find any silly mistakes, please report to the GitHub
      repository or send me email directly.</p> <p class="svelte-cjiik9">The most confusing part has been perhaps how the used accidentals are decided. I suppose in
      most cases you use either all flats or sharps but since sometimes a note is specified as
      either flat or sharp interval, I ultimately resolve to use its accidental. I&#39;m not sure if
      this is always the correct way but it was the most programming-friendly.</p> <p class="svelte-cjiik9">You can input a <b>Key</b> and visualize the notes in every scale. I am also displaying the
      <i>diatonic triads</i>
      for each scale degree and their respective chords. This &quot;diatonic triads&quot; is rather odd subject
      as there is not even a Wikipedia article about it and it&#39;s only briefly mentioned in
      <a href="https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns" target="_blank" class="svelte-cjiik9">Wikibooks.</a>
      How I have come to understand it is, that for every note in the scale you pick the 2nd and 4th
      next notes of the scale going up. This is the diatonic triad for that scale-degree. However, this
      falls apart quickly outside the standard 7 modes as the triads might not contain any thirds or
      fifths. Then you must manually check all the available options which might lead to finding multiple
      valid chords.</p> <p class="svelte-cjiik9">How I approach this is somewhat unscientific; I iterate every scale note and then map all the
      other notes as its intervals. Then I use
      major-minor-diminished-augmented-7th-6th-suspended-5th order to decide which triad to pick as
      this seems to follow the convention the best covering all scales currently listed. <i>However,</i>
      in some weird cases, the best fit I find is a <code class="svelte-cjiik9">sus</code> chord with no fifth in which case
      I add one. Which makes the triad not diatonic so uhh... I&#39;d love to hear opinions about this.</p> <p class="svelte-cjiik9">Clicking the notes or the triads will play them in the chosen key (or whatever is used in
      score). I am adding the 8th interval for every scale since it&#39;ll sound awfully incomplete
      otherwise.</p> <h3 class="svelte-cjiik9">Chords</h3> <p class="svelte-cjiik9">Similar to scales, you can input <b>Key</b>, <b>Scale</b> as well as root <b>Note</b> and have
      them shown for every chord. Key and scale only changes the notation of the accidentals. You can
      also select/unselect these chords to be used with the Write/Play Chords games. There is some quick-use
      buttons to select basic major/minor, seventh and all chords.</p> <h3 class="svelte-cjiik9">Score</h3> <p class="svelte-cjiik9">You can here set the played range of the keyboard notes and what&#39;s used in the games. I have
      only used C as the start/end note so there might be bugs lurking there. The scale and key
      determines the notation of the notes as well as the key signature.</p> <p class="svelte-cjiik9">The topic of the key signature (the added accidentals next to the clef) is rather ambiguous
      outside of major/minor distinction so I&#39;ve tried to come up with an easy compromise. The
      convention seems to be to use the closest major/minor approximate of the scale and then add
      the accidentals for the rest.</p> <p class="svelte-cjiik9">Programmatically speaking, it&#39;s much easier to consider key signature&#39;s function only as a
      time and space saver to declutter the score from accidentals and it&#39;s how I&#39;ve approached it.
      Although the order of the added accidentals stays always the same:
      <b>B♭, E♭, A♭, D♭, G♭, C♭, F♭</b>
      for flats and
      <b>F♯, C♯, G♯, D♯, A♯, E♯, B♯</b> for sharps. So if there were Bb, Eb, Db and Gb flats in the scale,
      the key signature would only include Bb, Eb and then use accidentals for the rest. I could add
      5 flats to the signature and then naturalize the As but that starts to get convoluted.</p> <h3 class="svelte-cjiik9">Play</h3> <p class="svelte-cjiik9">This is the meat of the app. There&#39;s a list of games you can play to practise your skills with
      the intention of adding a few more in the years to come. I hope they are quite
      self-explanatory as there&#39;s no instructions how to play them. <b>Guess Pitches</b> is relatively
      useless for those who have no chance of acquiring perfect pitch but it&#39;s fun to try once in a while.</p> <p class="svelte-cjiik9">In the base settings, I am by default enabling <b>Duplicates</b> and <b>Autoplay</b>
      as that seemed the most optimal for me. I&#39;m using true-random sampling so <b>Duplicates</b>
      might produce rather awkward sequential notes/chords which I might get around fixing at some point.</p> <p class="svelte-cjiik9">One big missing feature from the games are the inversions of chords as well missing notes.
      This is after all how majority of chords are played. But since it&#39;s rather big haven&#39;t had
      time to implement it. Also playing the given scale-degree diatonic triad would be another. As
      well as recognizing the played scales. Oh well. Pull requests are welcome!</p> <p class="svelte-cjiik9">As an end note, I hope this app will be helpful in learning music notation! I found multiple
      existing apps but I thought they were a little too complicated and slow to use. I can
      confidently say that I&#39;ve noticed a significant improvement myself playing these exercises and
      now as I revisit my old sheets it doesn&#39;t require pulling (as much) hair to decipher them 😄.</p>`,k,d,j;return i=new R({props:{icon:ie,width:24}}),{c(){t=b("div"),o=b("div"),e=b("button"),M(i.$$.fragment),a=q(),s=b("h2"),s.textContent=n,u=q(),c=b("article"),c.innerHTML=I,this.h()},l(r){t=g(r,"DIV",{tabindex:!0,class:!0});var h=w(t);o=g(h,"DIV",{class:!0});var f=w(o);e=g(f,"BUTTON",{class:!0});var $=w(e);z(i.$$.fragment,$),$.forEach(m),f.forEach(m),a=C(h),s=g(h,"H2",{class:!0,"data-svelte-h":!0}),P(s)!=="svelte-17w1g0f"&&(s.textContent=n),u=C(h),c=g(h,"ARTICLE",{class:!0,"data-svelte-h":!0}),P(c)!=="svelte-1bh3o17"&&(c.innerHTML=I),h.forEach(m),this.h()},h(){p(e,"class","flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"),p(o,"class","absolute op-0 right-0"),p(s,"class","pl-1.5 mt-4 mb-2 text-5xl font-semibold text-black"),p(c,"class","w-full p-2 pb-4 svelte-cjiik9"),p(t,"tabindex","-1"),p(t,"class","flex flex-col relative focus:outline-none")},m(r,h){S(r,t,h),y(t,o),y(o,e),D(i,e,null),y(t,a),y(t,s),y(t,u),y(t,c),l[4](t),k=!0,d||(j=[A(window,"keydown",l[2]),A(e,"click",function(){X(l[0])&&l[0].apply(this,arguments)})],d=!0)},p(r,[h]){l=r},i(r){k||(v(i.$$.fragment,r),k=!0)},o(r){_(i.$$.fragment,r),k=!1},d(r){r&&m(t),x(i),l[4](null),d=!1,Z(j)}}}function he(l,t,o){let{params:e}=t,{hideModal:i=()=>{}}=t,a,s;J(()=>(document.activeElement instanceof HTMLElement&&(a=document.activeElement),s.focus(),()=>{a.focus()}));function n(c){c.key==="Escape"&&i()}function u(c){Q[c?"unshift":"push"](()=>{s=c,o(1,s)})}return l.$$set=c=>{"params"in c&&o(3,e=c.params),"hideModal"in c&&o(0,i=c.hideModal)},[i,s,n,e,u]}class ue extends O{constructor(t){super(),H(this,t,he,ce,B,{params:3,hideModal:0})}}function N(l){let t,o,e,i,a,s,n,u,c,I,k;var d=l[2][l[0]];function j(r,h){return{props:{params:r[1][r[0]],hideModal:r[3]}}}return d&&(n=Y(d,j(l))),{c(){t=b("div"),o=b("button"),i=q(),a=b("div"),s=b("div"),n&&M(n.$$.fragment),this.h()},l(r){t=g(r,"DIV",{class:!0});var h=w(t);o=g(h,"BUTTON",{class:!0,tabindex:!0}),w(o).forEach(m),i=C(h),a=g(h,"DIV",{class:!0});var f=w(a);s=g(f,"DIV",{class:!0});var $=w(s);n&&z(n.$$.fragment,$),$.forEach(m),f.forEach(m),h.forEach(m),this.h()},h(){p(o,"class","fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default"),p(o,"tabindex","-1"),p(s,"class","relative flex flex-col p-6 text-left bg-gray-100"),p(a,"class","absolute top-4 bottom-0 mb-4 z-50 bg-gray-100 w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto md:max-w-3xl"),p(t,"class","fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center")},m(r,h){S(r,t,h),y(t,o),y(t,i),y(t,a),y(a,s),n&&D(n,s,null),c=!0,I||(k=A(o,"click",l[3]),I=!0)},p(r,h){if(l=r,h&1&&d!==(d=l[2][l[0]])){if(n){U();const f=n;_(f.$$.fragment,1,0,()=>{x(f,1)}),V()}d?(n=Y(d,j(l)),M(n.$$.fragment),v(n.$$.fragment,1),D(n,s,null)):n=null}else if(d){const f={};h&3&&(f.params=l[1][l[0]]),n.$set(f)}},i(r){c||(r&&F(()=>{c&&(e||(e=T(o,G,{duration:E},!0)),e.run(1))}),n&&v(n.$$.fragment,r),r&&F(()=>{c&&(u||(u=T(a,K,{duration:E},!0)),u.run(1))}),c=!0)},o(r){r&&(e||(e=T(o,G,{duration:E},!1)),e.run(0)),n&&_(n.$$.fragment,r),r&&(u||(u=T(a,K,{duration:E},!1)),u.run(0)),c=!1},d(r){r&&m(t),r&&e&&e.end(),n&&x(n),r&&u&&u.end(),I=!1,k()}}}function de(l){let t,o,e=l[0]&&N(l);return{c(){e&&e.c(),t=L()},l(i){e&&e.l(i),t=L()},m(i,a){e&&e.m(i,a),S(i,t,a),o=!0},p(i,[a]){i[0]?e?(e.p(i,a),a&1&&v(e,1)):(e=N(i),e.c(),v(e,1),e.m(t.parentNode,t)):e&&(U(),_(e,1,1,()=>{e=null}),V())},i(i){o||(v(e),o=!0)},o(i){_(e),o=!1},d(i){i&&m(t),e&&e.d(i)}}}const E=400;function fe(l,t,o){let e,i;W(l,oe,n=>o(0,e=n)),W(l,ne,n=>o(1,i=n));const a={introduction:ue};function s(){le.close()}return[e,i,a,s]}class pe extends O{constructor(t){super(),H(this,t,fe,de,B,{})}}function me(l){let t,o,e;const i=l[1].default,a=ee(i,l,l[0],null);return o=new pe({}),{c(){a&&a.c(),t=q(),M(o.$$.fragment)},l(s){a&&a.l(s),t=C(s),z(o.$$.fragment,s)},m(s,n){a&&a.m(s,n),S(s,t,n),D(o,s,n),e=!0},p(s,[n]){a&&a.p&&(!e||n&1)&&te(a,i,s,s[0],e?ae(i,s[0],n,null):se(s[0]),null)},i(s){e||(v(a,s),v(o.$$.fragment,s),e=!0)},o(s){_(a,s),_(o.$$.fragment,s),e=!1},d(s){s&&m(t),a&&a.d(s),x(o,s)}}}function ye(l,t,o){let{$$slots:e={},$$scope:i}=t;return l.$$set=a=>{"$$scope"in a&&o(0,i=a.$$scope)},[i,e]}class _e extends O{constructor(t){super(),H(this,t,ye,me,B,{})}}export{_e as component,we as universal};
