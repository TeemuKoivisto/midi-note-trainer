import{S as y,i as C,s as v,e as u,m as b,a as m,n as _,o as g,b as k,d as c,f as p,g as d,h as S,p as P,q as x,r as T}from"../chunks/vendor_svelte.687df11a.js";function q(i){let t,l="Synth",o,n,s,h="Play",r,f;return{c(){t=u("h1"),t.textContent=l,o=b(),n=u("section"),s=u("button"),s.textContent=h,this.h()},l(e){t=m(e,"H1",{class:!0,"data-svelte-h":!0}),_(t)!=="svelte-5kacpm"&&(t.textContent=l),o=g(e),n=m(e,"SECTION",{class:!0});var a=k(n);s=m(a,"BUTTON",{class:!0,"data-svelte-h":!0}),_(s)!=="svelte-12ba69d"&&(s.textContent=h),a.forEach(c),this.h()},h(){p(t,"class","my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight"),p(s,"class","btn primary"),p(n,"class","px-4 md:px-0")},m(e,a){d(e,t,a),d(e,o,a),d(e,n,a),S(n,s),r||(f=P(s,"click",i[0]),r=!0)},p:x,i:x,o:x,d(e){e&&(c(t),c(o),c(n)),r=!1,f()}}}function E(i){let t;T(()=>{t=new AudioContext});function l(){t.resume().then(()=>{console.log("Playback resumed successfully")})}return[l]}class O extends y{constructor(t){super(),C(this,t,E,q,v,{})}}export{O as component};