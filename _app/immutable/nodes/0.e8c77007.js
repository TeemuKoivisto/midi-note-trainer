import{S as x,i as O,s as q,O as N,e as v,J as M,n as A,a as k,b as _,K as C,d as u,p as E,o as J,f as b,g as I,h as j,L as D,q as U,U as R,t as g,l as w,M as S,x as P,F as V,y as K,P as W,I as Y,V as B,W as $,X as F,Y as G,c as X,u as Q,j as Z,k as ee}from"../chunks/vendor_svelte.80614c19.js";import{b as te}from"../chunks/vendor.d5730520.js";import{o as se,m as ae,a as ie}from"../chunks/modal.8700c8e9.js";/* empty css                         */const oe=!0,ge=Object.freeze(Object.defineProperty({__proto__:null,prerender:oe},Symbol.toStringTag,{value:"Module"}));function ne(l){let s,a,e,o,t,n=`<h2 class="text-5xl mt-6 mb-4 font-semibold text-black">Introduction</h2> <article class="w-full mt-2 svelte-cjiik9"><p class="svelte-cjiik9">Greetings! 👋</p> <p class="svelte-cjiik9">This is a tiny app that I made to help myself and hopefully others to learn music notation. In
      my opinion, you have to really drill them down until reading music becomes as easy as reading
      a language.</p> <p class="svelte-cjiik9">To get the full benefits of this app, I advise you to connect your MIDI keyboard to your
      computer. For most modern keyboards, you can do this directly with USB. With older models you
      need an audio interface to work as an adapter. You can also use your computer keyboard but it
      might not improve your piano playing as much.</p> <h3 class="svelte-cjiik9">I/O</h3> <p class="svelte-cjiik9">Under the <b>I/O Settings</b> you find controls to connect your MIDI keyboard which prompts
      for Web MIDI permissions. You can also fix your velocity incase your keyboard plays quietly
      (like mine). The default velocity without MIDI keyboard is 80. Enabling <b>Hotkeys</b> maps
      your keyboard to piano keyboard following similar format as in Ableton. With
      <b>Auto-octave</b>
      also enabled you can play notes with single keypresses. <b>Fade timeout</b> is how long in milliseconds
      notes appear in score once played. It does not effect the suspend of the piano as that would require
      coding a more sophisticated MIDI piano engine.</p> <p class="svelte-cjiik9">With <b>Set Hotkeys</b> you can visualize and customize the mapping. I explored keyboard
      layouts in different locales and noticed that my layout (ISO Finland) is quite rare so I
      wanted to make sure the hotkeys would work for others too. There is a rather curious &quot;code&quot;
      property in
      <code class="svelte-cjiik9">KeyboardEvent</code> that I&#39;m utilizing to identify the pressed keys which may not work for
      everyone.</p> <p class="svelte-cjiik9">Incase it doesn&#39;t, tick the <b>Custom</b> option and map the keys manually. Press the row you want
      to set and then every key in that row. If you want to skip a key, press space. You can also enable
      the use of two rows for piano keys. You can reset your settings from the reload icon.</p> <h3 class="svelte-cjiik9">Scales</h3> <p class="svelte-cjiik9">I went quite deep while coding this app to learn as much about music theory as possible 😅.
      This meant figuring out how to programmatically compute both the scales and chords without
      resolving to crude heuristics. Incase you find any silly mistakes, please report to the GitHub
      repository or send me email directly.</p> <p class="svelte-cjiik9">The most confusing part has been perhaps how the used accidentals are decided. I suppose in
      most cases you use either all flats or sharps but since some times a note is specified as
      either flat or sharp interval, I ultimately resolve to use its accidental. I&#39;m not if this is
      always the correct way but it was the most programming-friendly.</p> <p class="svelte-cjiik9">You can input a <b>Key</b> and visualize the notes in every scale. I am also displaying the
      <i>diatonic triads</i>
      for each scale degree and their respective chords. This is a rather curious since there isn&#39;t even
      a Wikipedia article on this subject, and only briefly mentioned in
      <a href="https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns" target="_blank" class="svelte-cjiik9">Wikibooks.</a>
      How I have come to understand it is, that for every note in the scale you pick the 2nd and 4th
      next notes of the scale going up. This is the diatonic triad for that scale-degree. However, this
      falls apart quickly outside the standard 7 modes as you might not find any suitable chord with
      zero thirds or fifths. Sometimes you want to pick the next note or the 3rd which leads to multiple
      valid chords.</p> <p class="svelte-cjiik9">How I approach this is somewhat unscientific; I construct all the intervals for every note and
      then pick the triad in major-minor-diminished-augmented-7th-6th-suspended-5th order. For some
      weird cases, there aren&#39;t even suspended chords in which case I am adding a perfect 5th to the
      triad even though it&#39;s not diatonic. Suggestions are welcome how to improve this.</p> <p class="svelte-cjiik9">Clicking the notes or the triads will play them in the chosen key (or whatever is used in
      score). I am adding the 8th interval for every scale since it&#39;ll sound awfully incomplete
      otherwise.</p> <h3 class="svelte-cjiik9">Chords</h3> <p class="svelte-cjiik9">Similar to scales, you can input <b>Key</b>, <b>Scale</b> as well as root <b>Note</b> and have
      them shown for every chord. Key and scale only changes the notation of the accidentals. You can
      also select/unselect these chords to be used with the Write/Play Chords games. There is some quick-use
      buttons to select basic major/minor, seventh and all chords.</p> <h3 class="svelte-cjiik9">Score</h3> <p class="svelte-cjiik9">You can here set the played range of the keyboard notes and what&#39;s used in the games. I have
      only used C as the starting/ending note so there might be bugs lurking there. The scale and
      key determines the notation of the notes as well as the key signature.</p> <p class="svelte-cjiik9">Outside of major/minor scale, the added accidentals to the key-signature is somewhat
      ambiguous. The convention seems to be to use the closest major/minor approximate of the scale
      and then add the accidentals for the rest.</p> <p class="svelte-cjiik9">Programmatically speaking, it&#39;s much easier to consider key signature&#39;s function only as a
      time and space saver to declutter the score from accidentals and is how I approach this. The
      order of the added flats and sharps stays however the same. <b>B♭, &#39;E♭, &#39;A♭, &#39;D♭, &#39;G♭, &#39;C♭, &#39;F♭</b>
      for flats and
      <b>F♯, &#39;C♯, &#39;G♯, &#39;D♯, &#39;A♯, &#39;E♯, &#39;B♯</b> for sharps. So if there were Bb, Eb, Db and Gb flats in
      the scale, the key signature would only include Bb, Eb and then use accidentals for the rest. I
      could add 5 flats to the signature and then naturalize the As but that seems a bit too much.</p> <h3 class="svelte-cjiik9">Play</h3> <p class="svelte-cjiik9">Here is the meat of this app. I&#39;ve added a few games to practise your skills but I could add a
      few more. Most are quite self-explanatory. The <b>Guess Pitches</b> game is relatively useless
      for those who have missed the boat for acquiring perfect pitch.</p> <p class="svelte-cjiik9">In the base settings, I am by default enabling <b>Duplicates</b> as well as <b>Autoplay</b>.
      Since the sampling is true-random, there might be same notes/chords in row which kinda sucks
      but disabling duplicates should help.</p> <p class="svelte-cjiik9">One big missing feature are the different inversions of chords and/or removed notes. This is
      how the majority of chords are played after all. It is, however, a rather big feature to build
      which is why it doesn&#39;t exist. Also playing the given scale-degree triad would be another. As
      well as recognizing the played scales. Oh well. Pull requests are welcome!</p> <p class="svelte-cjiik9">All in all, I hope this app will be helpful in learning music notation! I saw multiple
      existing apps but I thought they were a little too complicated and slow to use. I myself can
      happily say that I&#39;ve noticed a significant improvement and I can revisit my old sheets
      without having to pull my hair deciphering them 😄.</p></article>`,i,d,m;return e=new N({props:{icon:te,width:24}}),{c(){s=v("div"),a=v("button"),M(e.$$.fragment),o=A(),t=v("div"),t.innerHTML=n,this.h()},l(c){s=k(c,"DIV",{class:!0});var h=_(s);a=k(h,"BUTTON",{class:!0});var f=_(a);C(e.$$.fragment,f),f.forEach(u),h.forEach(u),o=E(c),t=k(c,"DIV",{class:!0,"data-svelte-h":!0}),J(t)!=="svelte-xd87s3"&&(t.innerHTML=n),this.h()},h(){b(a,"class","flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"),b(s,"class","absolute top-[1rem] right-[1rem]"),b(t,"class","mx-2 mt-2 mb-6 flex flex-col")},m(c,h){I(c,s,h),j(s,a),D(e,a,null),I(c,o,h),I(c,t,h),i=!0,d||(m=U(a,"click",function(){R(l[0])&&l[0].apply(this,arguments)}),d=!0)},p(c,[h]){l=c},i(c){i||(g(e.$$.fragment,c),i=!0)},o(c){w(e.$$.fragment,c),i=!1},d(c){c&&(u(s),u(o),u(t)),S(e),d=!1,m()}}}function le(l,s,a){let{params:e}=s,{hideModal:o=()=>{}}=s;return l.$$set=t=>{"params"in t&&a(1,e=t.params),"hideModal"in t&&a(0,o=t.hideModal)},[o,e]}class re extends x{constructor(s){super(),O(this,s,le,ne,q,{params:1,hideModal:0})}}function L(l){let s,a,e,o,t,n,i,d,m,c,h;var f=l[2][l[0]];function z(r,p){return{props:{params:r[1][r[0]],hideModal:r[3]}}}return f&&(i=Y(f,z(l))),{c(){s=v("div"),a=v("button"),o=A(),t=v("div"),n=v("div"),i&&M(i.$$.fragment),this.h()},l(r){s=k(r,"DIV",{class:!0});var p=_(s);a=k(p,"BUTTON",{class:!0,tabindex:!0}),_(a).forEach(u),o=E(p),t=k(p,"DIV",{class:!0});var y=_(t);n=k(y,"DIV",{class:!0});var H=_(n);i&&C(i.$$.fragment,H),H.forEach(u),y.forEach(u),p.forEach(u),this.h()},h(){b(a,"class","fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default"),b(a,"tabindex","-1"),b(n,"class","relative flex flex-col p-6 text-left bg-gray-100"),b(t,"class","absolute top-4 bottom-0 mb-4 z-50 bg-gray-100 w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto md:max-w-3xl"),b(s,"class","fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center")},m(r,p){I(r,s,p),j(s,a),j(s,o),j(s,t),j(t,n),i&&D(i,n,null),m=!0,c||(h=U(a,"click",l[3]),c=!0)},p(r,p){if(l=r,p&1&&f!==(f=l[2][l[0]])){if(i){V();const y=i;w(y.$$.fragment,1,0,()=>{S(y,1)}),K()}f?(i=Y(f,z(l)),M(i.$$.fragment),g(i.$$.fragment,1),D(i,n,null)):i=null}else if(f){const y={};p&3&&(y.params=l[1][l[0]]),i.$set(y)}},i(r){m||(r&&B(()=>{m&&(e||(e=$(a,F,{duration:T},!0)),e.run(1))}),i&&g(i.$$.fragment,r),r&&B(()=>{m&&(d||(d=$(t,G,{duration:T},!0)),d.run(1))}),m=!0)},o(r){r&&(e||(e=$(a,F,{duration:T},!1)),e.run(0)),i&&w(i.$$.fragment,r),r&&(d||(d=$(t,G,{duration:T},!1)),d.run(0)),m=!1},d(r){r&&u(s),r&&e&&e.end(),i&&S(i),r&&d&&d.end(),c=!1,h()}}}function ce(l){let s,a,e=l[0]&&L(l);return{c(){e&&e.c(),s=P()},l(o){e&&e.l(o),s=P()},m(o,t){e&&e.m(o,t),I(o,s,t),a=!0},p(o,[t]){o[0]?e?(e.p(o,t),t&1&&g(e,1)):(e=L(o),e.c(),g(e,1),e.m(s.parentNode,s)):e&&(V(),w(e,1,1,()=>{e=null}),K())},i(o){a||(g(e),a=!0)},o(o){w(e),a=!1},d(o){o&&u(s),e&&e.d(o)}}}const T=400;function de(l,s,a){let e,o;W(l,se,i=>a(0,e=i)),W(l,ae,i=>a(1,o=i));const t={introduction:re};function n(){ie.close()}return[e,o,t,n]}class ue extends x{constructor(s){super(),O(this,s,de,ce,q,{})}}function he(l){let s,a,e;const o=l[1].default,t=X(o,l,l[0],null);return a=new ue({}),{c(){t&&t.c(),s=A(),M(a.$$.fragment)},l(n){t&&t.l(n),s=E(n),C(a.$$.fragment,n)},m(n,i){t&&t.m(n,i),I(n,s,i),D(a,n,i),e=!0},p(n,[i]){t&&t.p&&(!e||i&1)&&Q(t,o,n,n[0],e?ee(o,n[0],i,null):Z(n[0]),null)},i(n){e||(g(t,n),g(a.$$.fragment,n),e=!0)},o(n){w(t,n),w(a.$$.fragment,n),e=!1},d(n){n&&u(s),t&&t.d(n),S(a,n)}}}function fe(l,s,a){let{$$slots:e={},$$scope:o}=s;return l.$$set=t=>{"$$scope"in t&&a(0,o=t.$$scope)},[o,e]}class ve extends x{constructor(s){super(),O(this,s,fe,he,q,{})}}export{ve as component,ge as universal};
