import{S as O,i as C,s as q,O as N,e as v,B as R,J as D,n as A,a as g,b as w,C as J,K as z,d as u,p as H,o as X,f as y,g as E,h as m,L as S,q as U,U as Q,t as _,l as I,M as x,x as P,F as V,y as K,P as B,I as W,V as Y,W as T,X as F,Y as L,c as Z,u as ee,j as te,k as se}from"../chunks/vendor_svelte.69274a52.js";import{b as ae}from"../chunks/vendor.d5730520.js";import{o as ie,m as oe,a as ne}from"../chunks/modal.3ae7c6e8.js";/* empty css                         */const le=!0,ke=Object.freeze(Object.defineProperty({__proto__:null,prerender:le},Symbol.toStringTag,{value:"Module"}));function re(l){let s,i,e,o,t,a,n,c,b=`<p class="svelte-cjiik9">Greetings! 👋</p> <p class="svelte-cjiik9">This is a tiny app that I made to help myself and hopefully others to learn music notation. In
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
      without having to pull my hair deciphering them 😄.</p>`,k,j,p;return a=new N({props:{icon:ae,width:24}}),{c(){s=v("div"),i=v("h2"),e=R(`Introduction
    `),o=v("div"),t=v("button"),D(a.$$.fragment),n=A(),c=v("article"),c.innerHTML=b,this.h()},l(d){s=g(d,"DIV",{class:!0});var r=w(s);i=g(r,"H2",{class:!0});var h=w(i);e=J(h,`Introduction
    `),o=g(h,"DIV",{class:!0});var f=w(o);t=g(f,"BUTTON",{class:!0});var $=w(t);z(a.$$.fragment,$),$.forEach(u),f.forEach(u),h.forEach(u),n=H(r),c=g(r,"ARTICLE",{class:!0,"data-svelte-h":!0}),X(c)!=="svelte-1wfluvr"&&(c.innerHTML=b),r.forEach(u),this.h()},h(){y(t,"class","flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"),y(o,"class","absolute top-0 right-0"),y(i,"class","pl-1.5 mt-4 mb-2 text-5xl font-semibold text-black relative"),y(c,"class","w-full p-2 pb-4 svelte-cjiik9"),y(s,"class","flex flex-col")},m(d,r){E(d,s,r),m(s,i),m(i,e),m(i,o),m(o,t),S(a,t,null),m(s,n),m(s,c),k=!0,j||(p=U(t,"click",function(){Q(l[0])&&l[0].apply(this,arguments)}),j=!0)},p(d,[r]){l=d},i(d){k||(_(a.$$.fragment,d),k=!0)},o(d){I(a.$$.fragment,d),k=!1},d(d){d&&u(s),x(a),j=!1,p()}}}function ce(l,s,i){let{params:e}=s,{hideModal:o=()=>{}}=s;return l.$$set=t=>{"params"in t&&i(1,e=t.params),"hideModal"in t&&i(0,o=t.hideModal)},[o,e]}class de extends O{constructor(s){super(),C(this,s,ce,re,q,{params:1,hideModal:0})}}function G(l){let s,i,e,o,t,a,n,c,b,k,j;var p=l[2][l[0]];function d(r,h){return{props:{params:r[1][r[0]],hideModal:r[3]}}}return p&&(n=W(p,d(l))),{c(){s=v("div"),i=v("button"),o=A(),t=v("div"),a=v("div"),n&&D(n.$$.fragment),this.h()},l(r){s=g(r,"DIV",{class:!0});var h=w(s);i=g(h,"BUTTON",{class:!0,tabindex:!0}),w(i).forEach(u),o=H(h),t=g(h,"DIV",{class:!0});var f=w(t);a=g(f,"DIV",{class:!0});var $=w(a);n&&z(n.$$.fragment,$),$.forEach(u),f.forEach(u),h.forEach(u),this.h()},h(){y(i,"class","fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default"),y(i,"tabindex","-1"),y(a,"class","relative flex flex-col p-6 text-left bg-gray-100"),y(t,"class","absolute top-4 bottom-0 mb-4 z-50 bg-gray-100 w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto md:max-w-3xl"),y(s,"class","fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center")},m(r,h){E(r,s,h),m(s,i),m(s,o),m(s,t),m(t,a),n&&S(n,a,null),b=!0,k||(j=U(i,"click",l[3]),k=!0)},p(r,h){if(l=r,h&1&&p!==(p=l[2][l[0]])){if(n){V();const f=n;I(f.$$.fragment,1,0,()=>{x(f,1)}),K()}p?(n=W(p,d(l)),D(n.$$.fragment),_(n.$$.fragment,1),S(n,a,null)):n=null}else if(p){const f={};h&3&&(f.params=l[1][l[0]]),n.$set(f)}},i(r){b||(r&&Y(()=>{b&&(e||(e=T(i,F,{duration:M},!0)),e.run(1))}),n&&_(n.$$.fragment,r),r&&Y(()=>{b&&(c||(c=T(t,L,{duration:M},!0)),c.run(1))}),b=!0)},o(r){r&&(e||(e=T(i,F,{duration:M},!1)),e.run(0)),n&&I(n.$$.fragment,r),r&&(c||(c=T(t,L,{duration:M},!1)),c.run(0)),b=!1},d(r){r&&u(s),r&&e&&e.end(),n&&x(n),r&&c&&c.end(),k=!1,j()}}}function he(l){let s,i,e=l[0]&&G(l);return{c(){e&&e.c(),s=P()},l(o){e&&e.l(o),s=P()},m(o,t){e&&e.m(o,t),E(o,s,t),i=!0},p(o,[t]){o[0]?e?(e.p(o,t),t&1&&_(e,1)):(e=G(o),e.c(),_(e,1),e.m(s.parentNode,s)):e&&(V(),I(e,1,1,()=>{e=null}),K())},i(o){i||(_(e),i=!0)},o(o){I(e),i=!1},d(o){o&&u(s),e&&e.d(o)}}}const M=400;function ue(l,s,i){let e,o;B(l,ie,n=>i(0,e=n)),B(l,oe,n=>i(1,o=n));const t={introduction:de};function a(){ne.close()}return[e,o,t,a]}class fe extends O{constructor(s){super(),C(this,s,ue,he,q,{})}}function pe(l){let s,i,e;const o=l[1].default,t=Z(o,l,l[0],null);return i=new fe({}),{c(){t&&t.c(),s=A(),D(i.$$.fragment)},l(a){t&&t.l(a),s=H(a),z(i.$$.fragment,a)},m(a,n){t&&t.m(a,n),E(a,s,n),S(i,a,n),e=!0},p(a,[n]){t&&t.p&&(!e||n&1)&&ee(t,o,a,a[0],e?se(o,a[0],n,null):te(a[0]),null)},i(a){e||(_(t,a),_(i.$$.fragment,a),e=!0)},o(a){I(t,a),I(i.$$.fragment,a),e=!1},d(a){a&&u(s),t&&t.d(a),x(i,a)}}}function me(l,s,i){let{$$slots:e={},$$scope:o}=s;return l.$$set=t=>{"$$scope"in t&&i(0,o=t.$$scope)},[o,e]}class we extends O{constructor(s){super(),C(this,s,me,pe,q,{})}}export{we as component,ke as universal};
