import{S as Q,i as U,s as J,O as ne,e as A,J as F,a as C,b as E,K as B,d as y,f as S,N as I,g as W,h as V,L as j,q as re,t as D,l as $,M as K,P as X,Q as q,R as G,n as te,p as se,T as ue,v as de,H as he}from"./vendor_svelte.dd4a4732.js";import{F as v}from"./vendor_vexflow.2dfca40b.js";import{p as ge,g as oe,c as Y,G as H,a as L,b as me,s as be,d as we,t as pe,e as ae,F as _e,S as ve}from"./3.0a1ec287.js";import{d as ye,a as Se}from"./vendor.e74270f4.js";function Ne(i){let t,s,l,a,n,f,m;return l=new ne({props:{icon:ye,width:32}}),{c(){t=A("div"),s=A("button"),F(l.$$.fragment),this.h()},l(e){t=C(e,"DIV",{class:!0});var c=E(t);s=C(c,"BUTTON",{class:!0});var w=E(s);B(l.$$.fragment,w),w.forEach(y),c.forEach(y),this.h()},h(){S(s,"class","flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"),S(t,"class",a=`${i[2].class||""}`),I(t,"hidden",!i[0])},m(e,c){W(e,t,c),V(t,s),j(l,s,null),n=!0,f||(m=re(s,"click",i[1]),f=!0)},p(e,[c]){(!n||c&4&&a!==(a=`${e[2].class||""}`))&&S(t,"class",a),(!n||c&5)&&I(t,"hidden",!e[0])},i(e){n||(D(l.$$.fragment,e),n=!0)},o(e){$(l.$$.fragment,e),n=!1},d(e){e&&y(t),K(l),f=!1,m()}}}function ke(i,t,s){let l,a,n,f;X(i,ge,e=>s(4,a=e)),X(i,oe,e=>s(5,n=e)),X(i,Y,e=>s(3,f=e));function m(){var c;const e=f;e instanceof H&&n==="waiting"?a==null||a.playChord(e.current.notes.map(w=>w.midi)):e instanceof H?a==null||a.playChord((((c=e.latestGuess.target)==null?void 0:c.notes)||[]).map(w=>w.midi)):e instanceof L&&n==="waiting"?a==null||a.noteOn(e.current):e instanceof L&&(a==null||a.noteOn(e.latestGuess.target||0))}return i.$$set=e=>{s(2,t=q(q({},t),G(e)))},i.$$.update=()=>{i.$$.dirty&8&&s(0,l=f instanceof H||f instanceof L)},t=G(t),[l,m,t,f]}class Ae extends Q{constructor(t){super(),U(this,t,ke,Ne,J,{})}}function Ce(i){let t,s,l,a,n,f,m;return l=new ne({props:{icon:Se,width:32}}),{c(){t=A("div"),s=A("button"),F(l.$$.fragment),this.h()},l(e){t=C(e,"DIV",{class:!0});var c=E(t);s=C(c,"BUTTON",{class:!0});var w=E(s);B(l.$$.fragment,w),w.forEach(y),c.forEach(y),this.h()},h(){S(s,"class","flex items-center justify-center rounded p-1 hover:bg-gray-200"),S(t,"class",a=`${i[2].class||""}`),I(t,"hidden",!i[0])},m(e,c){W(e,t,c),V(t,s),j(l,s,null),n=!0,f||(m=re(s,"click",i[1]),f=!0)},p(e,[c]){(!n||c&4&&a!==(a=`${e[2].class||""}`))&&S(t,"class",a),(!n||c&5)&&I(t,"hidden",!e[0])},i(e){n||(D(l.$$.fragment,e),n=!0)},o(e){$(l.$$.fragment,e),n=!1},d(e){e&&y(t),K(l),f=!1,m()}}}function Ee(i,t,s){let l;X(i,Y,n=>s(0,l=n));function a(){me.clearGame()}return i.$$set=n=>{s(2,t=q(q({},t),G(n)))},t=G(t),[l,a,t]}class Te extends Q{constructor(t){super(),U(this,t,Ee,Ce,J,{})}}function Ve(i){let t,s,l,a,n,f,m,e,c,w;return f=new Ae({}),e=new Te({}),{c(){t=A("section"),s=A("div"),l=te(),a=A("div"),n=A("div"),F(f.$$.fragment),m=te(),F(e.$$.fragment),this.h()},l(u){t=C(u,"SECTION",{class:!0});var N=E(t);s=C(N,"DIV",{id:!0}),E(s).forEach(y),l=se(N),a=C(N,"DIV",{class:!0});var M=E(a);n=C(M,"DIV",{class:!0});var x=E(n);B(f.$$.fragment,x),m=se(x),B(e.$$.fragment,x),x.forEach(y),M.forEach(y),N.forEach(y),this.h()},h(){S(s,"id","output"),S(n,"class","flex flex-col"),S(a,"class","absolute left-0 top-[18.5rem]"),S(t,"class",c=`${i[1].class||""} relative`)},m(u,N){W(u,t,N),V(t,s),i[2](s),V(t,l),V(t,a),V(a,n),j(f,n,null),V(n,m),j(e,n,null),w=!0},p(u,[N]){(!w||N&2&&c!==(c=`${u[1].class||""} relative`))&&S(t,"class",c)},i(u){w||(D(f.$$.fragment,u),D(e.$$.fragment,u),w=!0)},o(u){$(f.$$.fragment,u),$(e.$$.fragment,u),w=!1},d(u){u&&y(t),i[2](null),K(f),K(e)}}}function xe(i,t,s){const{Accidental:l,Formatter:a,Renderer:n,Stave:f,StaveNote:m}=v;let e=200,c,w,u;const N=ue([Y,oe,be,we,pe],([o,p,d,b,h])=>({game:o,guessed:p,scale:d,played:b,target:h}));de(()=>{x(),N.subscribe(o=>ce(o))});function M(o,p){const d=p.flats>0?p.flats:p.sharps,b=o.flats>0?o.flats:o.sharps,h=o.flats>0?"b":"#",g=(p.flats>0?_e:ve).slice(0,d),r=g.find(T=>T===o.note.slice(0,2))?b-1:b,_=o.note.length===1&&g.find(T=>T.charAt(0)===o.note.charAt(0));return{...o,parts:[o.note.charAt(0),`${_?"n":h.repeat(r)}`,ae(o)]}}function x(){w=new n(c,n.Backends.SVG),w.resize(732,360),u=w.getContext(),u.scale(2,2),new v.TickContext;const o=new f(0,0,e).addClef("treble").addKeySignature("B"),p=new f(0,60,e).addClef("bass").addKeySignature("B"),d=[new m({keys:["g#/4"],duration:"q"}),new m({keys:["b/4"],duration:"qr"}),new m({keys:["c/4"],duration:"q"}),new m({keys:["a/4","c/5","e/5"],duration:"q"})],b=[new m({clef:"bass",keys:["f/3"],duration:"q"}),new m({clef:"bass",keys:["b/3"],duration:"qr"}),new m({clef:"bass",keys:["b/2"],duration:"q"}),new m({clef:"bass",keys:["c/3","e/3","g/3"],duration:"q"})];d[0].addModifier(new l("#"),0);const h=new v.Voice({num_beats:4,beat_value:4}).addTickables(d),g=new v.Voice({num_beats:4,beat_value:4}).addTickables(b),r=Math.max(o.getNoteStartX(),p.getNoteStartX());o.setNoteStartX(r),p.setNoteStartX(r);const _=new v.Formatter;_.joinVoices([h]),_.joinVoices([g]),_.format([h,g],e-10-r),h.draw(u,o),g.draw(u,p),o.setContext(u).draw(),p.setContext(u).draw()}function Z(o,p){const d=[],b=[];for(let g=0;g<o.length;g+=1){const r=o[g],_=ae(r),T="color"in r&&r.color!=="default"?r.color==="correct"?"rgb(34, 197, 94)":"red":void 0,O={...M(o[g],p),color:T};_<4?d.push(O):b.push(O)}const h=[];if(d.length>0){const g=new v.StaveNote({clef:"bass",keys:d.map(r=>`${r.parts[0]}${r.parts[1]}/${r.parts[2]}`),duration:"w"}).setAttribute("clef","bass");d.forEach((r,_)=>{r.parts[1]&&g.addModifier(new l(r.parts[1]),_),r.color&&g.setStyle({fillStyle:r.color})}),h.push(g)}if(b.length>0){const g=new v.StaveNote({clef:"treble",keys:b.map(r=>`${r.parts[0]}${r.parts[1]}/${r.parts[2]}`),duration:"w"}).setAttribute("clef","treble");b.forEach((r,_)=>{r.parts[1]&&g.addModifier(new l(r.parts[1]),_),r.color&&g.setStyle({fillStyle:r.color})}),h.push(g)}return h}function le(o,p){const d=[],b=[];return o.forEach(h=>{h.getAttribute("clef")==="treble"?d.push(h):b.push(h)}),d.length===0&&b.length>0&&p.length>0?d.push(new v.StaveNote({clef:"treble",keys:["G/4"],duration:"w"}).setStyle({fillStyle:"#fff"})):b.length===0&&d.length>0&&p.length>0&&b.push(new v.StaveNote({clef:"bass",keys:["F/3"],duration:"w"}).setStyle({fillStyle:"#fff"})),d.push(...p.filter(h=>h.getAttribute("clef")==="treble")),b.push(...p.filter(h=>h.getAttribute("clef")==="bass")),[d,b]}function ce({game:o,guessed:p,scale:d,played:b,target:h}){const g=d.majorSignature.replaceAll("♭","b").replaceAll("♯","#");e=200+Math.max(d.flats,d.sharps)*10,u.clear(),u.scale(.5,.5);const r=new f(0,0,e).addClef("treble").addKeySignature(g),_=new f(0,60,e).addClef("bass"),T=Z(h,d),O=Z(b,d),[R,P]=le(T,O),k=[];R.length>0&&k.push(new v.Voice({num_beats:4,beat_value:4}).setMode(2).addTickables(R)),P.length>0&&k.push(new v.Voice({num_beats:4,beat_value:4}).setMode(2).addTickables(P));const z=Math.max(r.getNoteStartX(),_.getNoteStartX());r.setNoteStartX(z),_.setNoteStartX(z);const ee=new v.Formatter;k.forEach(fe=>{ee.joinVoices([fe])}),k.length>0&&ee.format(k,e-10-z),R.length>0&&k[0].draw(u,r),P.length>0&&k[k.length-1].draw(u,_),r.setContext(u).draw(),_.setContext(u).draw()}function ie(o){he[o?"unshift":"push"](()=>{c=o,s(0,c)})}return i.$$set=o=>{s(1,t=q(q({},t),G(o)))},t=G(t),[c,t,ie]}class Xe extends Q{constructor(t){super(),U(this,t,xe,Ve,J,{})}}export{Xe as default};
