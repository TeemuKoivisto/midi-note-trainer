import{S as A,i as E,s as H,O as R,e as b,a as x,b as C,g,h as w,d as z,j as p,f as M,x as B,k as y,l as O,n as m,m as D,y as F,V as J,t as v,q as _,r as S,B as P,J as U,C as K,Q as W,N as Y,W as G,X as T,Y as L,Z as N,c as Q,u as X,o as Z,p as ee}from"../chunks/vendor_svelte.8c64bedb.js";import{b as te}from"../chunks/vendor.e9b0235c.js";import{o as se,m as ae,a as ie}from"../chunks/modal.c52dc189.js";/* empty css                         */const oe=!0,ge=Object.freeze(Object.defineProperty({__proto__:null,prerender:oe},Symbol.toStringTag,{value:"Module"}));function ne(r){let t,o,e,i,s,a,n="Introduction",d,h,I=`<p class="svelte-cjiik9">Greetings! 👋</p> <p class="svelte-cjiik9">This is a tiny app that I made to help myself and hopefully others to learn music notation. I
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
      now as I revisit my old sheets it doesn&#39;t require pulling (as much) hair to decipher them 😄.</p>`,k,u,j;return i=new R({props:{icon:te,width:24}}),{c(){t=b("div"),o=b("div"),e=b("button"),x(i.$$.fragment),s=C(),a=b("h2"),a.textContent=n,d=C(),h=b("article"),h.innerHTML=I,this.h()},l(l){t=g(l,"DIV",{class:!0});var c=w(t);o=g(c,"DIV",{class:!0});var f=w(o);e=g(f,"BUTTON",{class:!0});var $=w(e);z(i.$$.fragment,$),$.forEach(p),f.forEach(p),s=M(c),a=g(c,"H2",{class:!0,"data-svelte-h":!0}),B(a)!=="svelte-17w1g0f"&&(a.textContent=n),d=M(c),h=g(c,"ARTICLE",{class:!0,"data-svelte-h":!0}),B(h)!=="svelte-1bh3o17"&&(h.innerHTML=I),c.forEach(p),this.h()},h(){y(e,"class","flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"),y(o,"class","absolute op-0 right-0"),y(a,"class","pl-1.5 mt-4 mb-2 text-5xl font-semibold text-black"),y(h,"class","w-full p-2 pb-4 svelte-cjiik9"),y(t,"class","flex flex-col relative")},m(l,c){O(l,t,c),m(t,o),m(o,e),D(i,e,null),m(t,s),m(t,a),m(t,d),m(t,h),k=!0,u||(j=F(e,"click",function(){J(r[0])&&r[0].apply(this,arguments)}),u=!0)},p(l,[c]){r=l},i(l){k||(v(i.$$.fragment,l),k=!0)},o(l){_(i.$$.fragment,l),k=!1},d(l){l&&p(t),S(i),u=!1,j()}}}function le(r,t,o){let{params:e}=t,{hideModal:i=()=>{}}=t;return r.$$set=s=>{"params"in s&&o(1,e=s.params),"hideModal"in s&&o(0,i=s.hideModal)},[i,e]}class re extends A{constructor(t){super(),E(this,t,le,ne,H,{params:1,hideModal:0})}}function V(r){let t,o,e,i,s,a,n,d,h,I,k;var u=r[2][r[0]];function j(l,c){return{props:{params:l[1][l[0]],hideModal:l[3]}}}return u&&(n=Y(u,j(r))),{c(){t=b("div"),o=b("button"),i=C(),s=b("div"),a=b("div"),n&&x(n.$$.fragment),this.h()},l(l){t=g(l,"DIV",{class:!0});var c=w(t);o=g(c,"BUTTON",{class:!0,tabindex:!0}),w(o).forEach(p),i=M(c),s=g(c,"DIV",{class:!0});var f=w(s);a=g(f,"DIV",{class:!0});var $=w(a);n&&z(n.$$.fragment,$),$.forEach(p),f.forEach(p),c.forEach(p),this.h()},h(){y(o,"class","fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default"),y(o,"tabindex","-1"),y(a,"class","relative flex flex-col p-6 text-left bg-gray-100"),y(s,"class","absolute top-4 bottom-0 mb-4 z-50 bg-gray-100 w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto md:max-w-3xl"),y(t,"class","fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center")},m(l,c){O(l,t,c),m(t,o),m(t,i),m(t,s),m(s,a),n&&D(n,a,null),h=!0,I||(k=F(o,"click",r[3]),I=!0)},p(l,c){if(r=l,c&1&&u!==(u=r[2][r[0]])){if(n){U();const f=n;_(f.$$.fragment,1,0,()=>{S(f,1)}),K()}u?(n=Y(u,j(r)),x(n.$$.fragment),v(n.$$.fragment,1),D(n,a,null)):n=null}else if(u){const f={};c&3&&(f.params=r[1][r[0]]),n.$set(f)}},i(l){h||(l&&G(()=>{h&&(e||(e=T(o,L,{duration:q},!0)),e.run(1))}),n&&v(n.$$.fragment,l),l&&G(()=>{h&&(d||(d=T(s,N,{duration:q},!0)),d.run(1))}),h=!0)},o(l){l&&(e||(e=T(o,L,{duration:q},!1)),e.run(0)),n&&_(n.$$.fragment,l),l&&(d||(d=T(s,N,{duration:q},!1)),d.run(0)),h=!1},d(l){l&&p(t),l&&e&&e.end(),n&&S(n),l&&d&&d.end(),I=!1,k()}}}function ce(r){let t,o,e=r[0]&&V(r);return{c(){e&&e.c(),t=P()},l(i){e&&e.l(i),t=P()},m(i,s){e&&e.m(i,s),O(i,t,s),o=!0},p(i,[s]){i[0]?e?(e.p(i,s),s&1&&v(e,1)):(e=V(i),e.c(),v(e,1),e.m(t.parentNode,t)):e&&(U(),_(e,1,1,()=>{e=null}),K())},i(i){o||(v(e),o=!0)},o(i){_(e),o=!1},d(i){i&&p(t),e&&e.d(i)}}}const q=400;function he(r,t,o){let e,i;W(r,se,n=>o(0,e=n)),W(r,ae,n=>o(1,i=n));const s={introduction:re};function a(){ie.close()}return[e,i,s,a]}class de extends A{constructor(t){super(),E(this,t,he,ce,H,{})}}function ue(r){let t,o,e;const i=r[1].default,s=Q(i,r,r[0],null);return o=new de({}),{c(){s&&s.c(),t=C(),x(o.$$.fragment)},l(a){s&&s.l(a),t=M(a),z(o.$$.fragment,a)},m(a,n){s&&s.m(a,n),O(a,t,n),D(o,a,n),e=!0},p(a,[n]){s&&s.p&&(!e||n&1)&&X(s,i,a,a[0],e?ee(i,a[0],n,null):Z(a[0]),null)},i(a){e||(v(s,a),v(o.$$.fragment,a),e=!0)},o(a){_(s,a),_(o.$$.fragment,a),e=!1},d(a){a&&p(t),s&&s.d(a),S(o,a)}}}function fe(r,t,o){let{$$slots:e={},$$scope:i}=t;return r.$$set=s=>{"$$scope"in s&&o(0,i=s.$$scope)},[i,e]}class ve extends A{constructor(t){super(),E(this,t,fe,ue,H,{})}}export{ve as component,ge as universal};
