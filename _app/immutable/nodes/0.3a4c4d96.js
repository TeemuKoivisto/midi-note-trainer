import{S as O,i as S,s as C,O as N,e as v,B as R,J as x,n as A,a as g,b as w,C as J,K as H,d as u,p as z,o as X,f as y,g as E,h as m,L as q,q as U,U as Q,t as _,l as I,M as D,x as P,F as V,y as K,P as B,I as Y,V as L,W as T,X as W,Y as F,c as Z,u as ee,j as te,k as se}from"../chunks/vendor_svelte.73f92ca9.js";import{b as ae}from"../chunks/vendor.e9b0235c.js";import{o as ie,m as oe,a as ne}from"../chunks/modal.3afaeb27.js";/* empty css                         */const le=!0,ke=Object.freeze(Object.defineProperty({__proto__:null,prerender:le},Symbol.toStringTag,{value:"Module"}));function re(l){let s,i,e,o,t,a,n,c,b=`<p class="svelte-cjiik9">Greetings! 👋</p> <p class="svelte-cjiik9">This is a tiny app that I made to help myself and hopefully others to learn music notation. I
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
      <code class="svelte-cjiik9">KeyboardEvent</code> which may not work for everyone.</p> <p class="svelte-cjiik9">Incase it doesn&#39;t, tick the <b>Custom</b> option and map the keys manually. Press the row you want
      to set and then every key in that row. If you want to skip a key, press space. You can also enable
      the use of two rows for piano keys. You can reset your settings from the reload icon.</p> <h3 class="svelte-cjiik9">Scales</h3> <p class="svelte-cjiik9">I went quite deep while coding this app to learn as much about music theory as possible 😵‍💫.
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
      this seems to follow the convention the best and cover all scales currently listed. <i>However,</i>
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
      The order of the added accidentals stays however always the same:
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
      This is after all how majority of chords are played. It is, however, a rather big feature to
      implement which is why it doesn&#39;t exist. Also playing the given scale-degree diatonic triad
      would be another. As well as recognizing the played scales. Oh well. Pull requests are
      welcome!</p> <p class="svelte-cjiik9">As an end note, I hope this app will be helpful in learning music notation! I found multiple
      existing apps but I thought they were a little too complicated and slow to use. I can
      confidently say that I&#39;ve noticed a significant improvement myself playing these exercises and
      revisiting my old sheets doesn&#39;t require pulling (as much) hair to decipher them 😄.</p>`,k,j,p;return a=new N({props:{icon:ae,width:24}}),{c(){s=v("div"),i=v("h2"),e=R(`Introduction
    `),o=v("div"),t=v("button"),x(a.$$.fragment),n=A(),c=v("article"),c.innerHTML=b,this.h()},l(h){s=g(h,"DIV",{class:!0});var r=w(s);i=g(r,"H2",{class:!0});var d=w(i);e=J(d,`Introduction
    `),o=g(d,"DIV",{class:!0});var f=w(o);t=g(f,"BUTTON",{class:!0});var $=w(t);H(a.$$.fragment,$),$.forEach(u),f.forEach(u),d.forEach(u),n=z(r),c=g(r,"ARTICLE",{class:!0,"data-svelte-h":!0}),X(c)!=="svelte-bhls3i"&&(c.innerHTML=b),r.forEach(u),this.h()},h(){y(t,"class","flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"),y(o,"class","absolute top-0 right-0"),y(i,"class","pl-1.5 mt-4 mb-2 text-5xl font-semibold text-black relative"),y(c,"class","w-full p-2 pb-4 svelte-cjiik9"),y(s,"class","flex flex-col")},m(h,r){E(h,s,r),m(s,i),m(i,e),m(i,o),m(o,t),q(a,t,null),m(s,n),m(s,c),k=!0,j||(p=U(t,"click",function(){Q(l[0])&&l[0].apply(this,arguments)}),j=!0)},p(h,[r]){l=h},i(h){k||(_(a.$$.fragment,h),k=!0)},o(h){I(a.$$.fragment,h),k=!1},d(h){h&&u(s),D(a),j=!1,p()}}}function ce(l,s,i){let{params:e}=s,{hideModal:o=()=>{}}=s;return l.$$set=t=>{"params"in t&&i(1,e=t.params),"hideModal"in t&&i(0,o=t.hideModal)},[o,e]}class he extends O{constructor(s){super(),S(this,s,ce,re,C,{params:1,hideModal:0})}}function G(l){let s,i,e,o,t,a,n,c,b,k,j;var p=l[2][l[0]];function h(r,d){return{props:{params:r[1][r[0]],hideModal:r[3]}}}return p&&(n=Y(p,h(l))),{c(){s=v("div"),i=v("button"),o=A(),t=v("div"),a=v("div"),n&&x(n.$$.fragment),this.h()},l(r){s=g(r,"DIV",{class:!0});var d=w(s);i=g(d,"BUTTON",{class:!0,tabindex:!0}),w(i).forEach(u),o=z(d),t=g(d,"DIV",{class:!0});var f=w(t);a=g(f,"DIV",{class:!0});var $=w(a);n&&H(n.$$.fragment,$),$.forEach(u),f.forEach(u),d.forEach(u),this.h()},h(){y(i,"class","fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default"),y(i,"tabindex","-1"),y(a,"class","relative flex flex-col p-6 text-left bg-gray-100"),y(t,"class","absolute top-4 bottom-0 mb-4 z-50 bg-gray-100 w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto md:max-w-3xl"),y(s,"class","fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center")},m(r,d){E(r,s,d),m(s,i),m(s,o),m(s,t),m(t,a),n&&q(n,a,null),b=!0,k||(j=U(i,"click",l[3]),k=!0)},p(r,d){if(l=r,d&1&&p!==(p=l[2][l[0]])){if(n){V();const f=n;I(f.$$.fragment,1,0,()=>{D(f,1)}),K()}p?(n=Y(p,h(l)),x(n.$$.fragment),_(n.$$.fragment,1),q(n,a,null)):n=null}else if(p){const f={};d&3&&(f.params=l[1][l[0]]),n.$set(f)}},i(r){b||(r&&L(()=>{b&&(e||(e=T(i,W,{duration:M},!0)),e.run(1))}),n&&_(n.$$.fragment,r),r&&L(()=>{b&&(c||(c=T(t,F,{duration:M},!0)),c.run(1))}),b=!0)},o(r){r&&(e||(e=T(i,W,{duration:M},!1)),e.run(0)),n&&I(n.$$.fragment,r),r&&(c||(c=T(t,F,{duration:M},!1)),c.run(0)),b=!1},d(r){r&&u(s),r&&e&&e.end(),n&&D(n),r&&c&&c.end(),k=!1,j()}}}function de(l){let s,i,e=l[0]&&G(l);return{c(){e&&e.c(),s=P()},l(o){e&&e.l(o),s=P()},m(o,t){e&&e.m(o,t),E(o,s,t),i=!0},p(o,[t]){o[0]?e?(e.p(o,t),t&1&&_(e,1)):(e=G(o),e.c(),_(e,1),e.m(s.parentNode,s)):e&&(V(),I(e,1,1,()=>{e=null}),K())},i(o){i||(_(e),i=!0)},o(o){I(e),i=!1},d(o){o&&u(s),e&&e.d(o)}}}const M=400;function ue(l,s,i){let e,o;B(l,ie,n=>i(0,e=n)),B(l,oe,n=>i(1,o=n));const t={introduction:he};function a(){ne.close()}return[e,o,t,a]}class fe extends O{constructor(s){super(),S(this,s,ue,de,C,{})}}function pe(l){let s,i,e;const o=l[1].default,t=Z(o,l,l[0],null);return i=new fe({}),{c(){t&&t.c(),s=A(),x(i.$$.fragment)},l(a){t&&t.l(a),s=z(a),H(i.$$.fragment,a)},m(a,n){t&&t.m(a,n),E(a,s,n),q(i,a,n),e=!0},p(a,[n]){t&&t.p&&(!e||n&1)&&ee(t,o,a,a[0],e?se(o,a[0],n,null):te(a[0]),null)},i(a){e||(_(t,a),_(i.$$.fragment,a),e=!0)},o(a){I(t,a),I(i.$$.fragment,a),e=!1},d(a){a&&u(s),t&&t.d(a),D(i,a)}}}function me(l,s,i){let{$$slots:e={},$$scope:o}=s;return l.$$set=t=>{"$$scope"in t&&i(0,o=t.$$scope)},[o,e]}class we extends O{constructor(s){super(),S(this,s,me,pe,C,{})}}export{we as component,ke as universal};
