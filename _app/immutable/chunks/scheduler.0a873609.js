var R=Object.defineProperty;var q=(t,e,n)=>e in t?R(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var f=(t,e,n)=>(q(t,typeof e!="symbol"?e+"":e,n),n);function G(){}const rt=t=>t;function z(t,e){for(const n in e)t[n]=e[n];return t}function F(t){return t()}function ot(){return Object.create(null)}function I(t){t.forEach(F)}function ut(t){return typeof t=="function"}function at(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function ft(t){return Object.keys(t).length===0}function D(t,...e){if(t==null){for(const i of e)i(void 0);return G}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function _t(t){let e;return D(t,n=>e=n)(),e}function ht(t,e,n){t.$$.on_destroy.push(D(e,n))}function dt(t,e,n,i){if(t){const s=L(t,e,n,i);return t[0](s)}}function L(t,e,n,i){return t[1]&&i?z(n.ctx.slice(),t[1](i(e))):n.ctx}function mt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const r=[],l=Math.max(e.dirty.length,s.length);for(let o=0;o<l;o+=1)r[o]=e.dirty[o]|s[o];return r}return e.dirty|s}return e.dirty}function pt(t,e,n,i,s,r){if(s){const l=L(e,n,i,r);t.p(l,s)}}function yt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function gt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function bt(t){return t??""}let p=!1;function xt(){p=!0}function Et(){p=!1}function U(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function W(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&c.push(a)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,a=(s>0&&e[n[s]].claim_order<=u?s+1:U(1,s,B=>e[n[B]].claim_order,u))-1;i[c]=n[a]+1;const N=a+1;n[N]=c,s=Math.max(N,s)}const r=[],l=[];let o=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(r.push(e[c-1]);o>=c;o--)l.push(e[o]);o--}for(;o>=0;o--)l.push(e[o]);r.reverse(),l.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<l.length;c++){for(;u<r.length&&l[c].claim_order>=r[u].claim_order;)u++;const a=u<r.length?r[u]:null;t.insertBefore(l[c],a)}}function J(t,e){t.appendChild(e)}function K(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function vt(t){const e=v("style");return e.textContent="/* empty */",Q(K(t),e),e.sheet}function Q(t,e){return J(t.head||t,e),e.sheet}function V(t,e){if(p){for(W(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function X(t,e,n){t.insertBefore(e,n||null)}function Y(t,e,n){p&&!n?V(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function x(t){t.parentNode&&t.parentNode.removeChild(t)}function wt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function v(t){return document.createElement(t)}function M(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function w(t){return document.createTextNode(t)}function Tt(){return w(" ")}function Nt(){return w("")}function At(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function j(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const Z=["width","height"];function kt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&Z.indexOf(i)===-1?t[i]=e[i]:j(t,i,e[i])}function Ht(t,e){for(const n in e)j(t,n,e[n])}function Dt(t){return t.dataset.svelteH}function Lt(t){return t===""?null:+t}function Mt(t){return Array.from(t.childNodes)}function C(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function P(t,e,n,i,s=!1){C(t);const r=(()=>{for(let l=t.claim_info.last_index;l<t.length;l++){const o=t[l];if(e(o)){const c=n(o);return c===void 0?t.splice(l,1):t[l]=c,s||(t.claim_info.last_index=l),o}}for(let l=t.claim_info.last_index-1;l>=0;l--){const o=t[l];if(e(o)){const c=n(o);return c===void 0?t.splice(l,1):t[l]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=l,o}}return i()})();return r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,r}function S(t,e,n,i){return P(t,s=>s.nodeName===e,s=>{const r=[];for(let l=0;l<s.attributes.length;l++){const o=s.attributes[l];n[o.name]||r.push(o.name)}r.forEach(l=>s.removeAttribute(l))},()=>i(e))}function jt(t,e,n){return S(t,e,n,v)}function Ct(t,e,n){return S(t,e,n,M)}function $(t,e){return P(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>w(e),!0)}function Pt(t){return $(t," ")}function A(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return-1}function St(t,e){const n=A(t,"HTML_TAG_START",0),i=A(t,"HTML_TAG_END",n+1);if(n===-1||i===-1)return new y(e);C(t);const s=t.splice(n,i-n+1);x(s[0]),x(s[s.length-1]);const r=s.slice(1,s.length-1);if(r.length===0)return new y(e);for(const l of r)l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new y(e,r)}function Ot(t,e){e=""+e,t.data!==e&&(t.data=e)}function Bt(t,e){t.value=e??""}function Rt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function qt(t,e,n){t.classList.toggle(e,!!n)}function tt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Gt(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const r=s.textContent.trim();r===`HEAD_${t}_END`?(i-=1,n.push(s)):r===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class et{constructor(e=!1){f(this,"is_svg",!1);f(this,"e");f(this,"n");f(this,"t");f(this,"a");this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=M(n.nodeName):this.e=v(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)X(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(x)}}class y extends et{constructor(n=!1,i){super(n);f(this,"l");this.e=this.n=null,this.l=i}c(n){this.l?this.n=this.l:super.c(n)}i(n){for(let i=0;i<this.n.length;i+=1)Y(this.t,this.n[i],n)}}function zt(t,e){return new t(e)}let m;function g(t){m=t}function T(){if(!m)throw new Error("Function called outside component initialization");return m}function Ft(t){T().$$.on_mount.push(t)}function It(t){T().$$.after_update.push(t)}function Ut(){const t=T();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const r=tt(e,n,{cancelable:i});return s.slice().forEach(l=>{l.call(t,r)}),!r.defaultPrevented}return!0}}function Wt(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const d=[],k=[];let h=[];const H=[],O=Promise.resolve();let E=!1;function nt(){E||(E=!0,O.then(st))}function Jt(){return nt(),O}function it(t){h.push(t)}const b=new Set;let _=0;function st(){if(_!==0)return;const t=m;do{try{for(;_<d.length;){const e=d[_];_++,g(e),lt(e.$$)}}catch(e){throw d.length=0,_=0,e}for(g(null),d.length=0,_=0;k.length;)k.pop()();for(let e=0;e<h.length;e+=1){const n=h[e];b.has(n)||(b.add(n),n())}h.length=0}while(d.length);for(;H.length;)H.pop()();E=!1,b.clear(),g(t)}function lt(t){if(t.fragment!==null){t.update(),I(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(it)}}function Kt(t){const e=[],n=[];h.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),h=e}export{ot as $,_t as A,Dt as B,qt as C,bt as D,At as E,wt as F,I as G,z as H,gt as I,Bt as J,Ut as K,kt as L,M,y as N,Ct as O,St as P,Ht as Q,rt as R,it as S,Lt as T,Wt as U,Gt as V,D as W,ut as X,K as Y,vt as Z,tt as _,Tt as a,st as a0,ft as a1,Kt as a2,m as a3,g as a4,F as a5,d as a6,nt as a7,xt as a8,Et as a9,It as b,Pt as c,x as d,Nt as e,v as f,jt as g,Mt as h,Y as i,j,Rt as k,w as l,$ as m,Ot as n,Ft as o,k as p,zt as q,dt as r,at as s,Jt as t,pt as u,yt as v,mt as w,V as x,G as y,ht as z};
