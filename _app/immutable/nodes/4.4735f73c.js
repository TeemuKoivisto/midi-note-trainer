import{s as y,f as u,a as C,g as m,B as _,c as v,h as b,d as c,j as p,i as x,x as g,E as k,y as d,o as S}from"../chunks/scheduler.d23c7d87.js";import{S as E,i as P}from"../chunks/index.4fe5b511.js";function T(i){let t,l="Synth",o,n,s,f="Play",r,h;return{c(){t=u("h1"),t.textContent=l,o=C(),n=u("section"),s=u("button"),s.textContent=f,this.h()},l(e){t=m(e,"H1",{class:!0,"data-svelte-h":!0}),_(t)!=="svelte-5kacpm"&&(t.textContent=l),o=v(e),n=m(e,"SECTION",{class:!0});var a=b(n);s=m(a,"BUTTON",{class:!0,"data-svelte-h":!0}),_(s)!=="svelte-12ba69d"&&(s.textContent=f),a.forEach(c),this.h()},h(){p(t,"class","my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight"),p(s,"class","btn primary"),p(n,"class","px-4 md:px-0")},m(e,a){x(e,t,a),x(e,o,a),x(e,n,a),g(n,s),r||(h=k(s,"click",i[0]),r=!0)},p:d,i:d,o:d,d(e){e&&(c(t),c(o),c(n)),r=!1,h()}}}function B(i){let t;S(()=>{t=new AudioContext});function l(){t.resume().then(()=>{console.log("Playback resumed successfully")})}return[l]}class $ extends E{constructor(t){super(),P(this,t,B,T,y,{})}}export{$ as component};