import{w as u}from"./index.951cbc10.js";var _;const k=((_=globalThis.__sveltekit_4yqaya)==null?void 0:_.base)??"/midi-note-trainer";var g;const y=((g=globalThis.__sveltekit_4yqaya)==null?void 0:g.assets)??k,m="1708614917410",R="sveltekit:snapshot",T="sveltekit:scroll",I="sveltekit:index",f={tap:1,hover:2,viewport:3,eager:4,off:-1},h=location.origin;function S(e){let t=e.baseURI;if(!t){const n=e.getElementsByTagName("base");t=n.length?n[0].href:e.URL}return t}function x(){return{x:pageXOffset,y:pageYOffset}}function c(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const d={...f,"":f.hover};function b(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function O(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=b(e)}}function U(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const o=e instanceof SVGAElement?e.target.baseVal:e.target,r=!n||!!o||E(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),l=(n==null?void 0:n.origin)===h&&e.hasAttribute("download");return{url:n,external:r,target:o,download:l}}function L(e){let t=null,n=null,o=null,r=null,l=null,s=null,a=e;for(;a&&a!==document.documentElement;)o===null&&(o=c(a,"preload-code")),r===null&&(r=c(a,"preload-data")),t===null&&(t=c(a,"keepfocus")),n===null&&(n=c(a,"noscroll")),l===null&&(l=c(a,"reload")),s===null&&(s=c(a,"replacestate")),a=b(a);function i(v){switch(v){case"":case"true":return!0;case"off":case"false":return!1;default:return null}}return{preload_code:d[o??"off"],preload_data:d[r??"off"],keep_focus:i(t),noscroll:i(n),reload:i(l),replace_state:i(s)}}function p(e){const t=u(e);let n=!0;function o(){n=!0,t.update(s=>s)}function r(s){n=!1,t.set(s)}function l(s){let a;return t.subscribe(i=>{(a===void 0||n&&i!==a)&&s(a=i)})}return{notify:o,set:r,subscribe:l}}function w(){const{set:e,subscribe:t}=u(!1);let n;async function o(){clearTimeout(n);try{const r=await fetch(`${y}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!r.ok)return!1;const s=(await r.json()).version!==m;return s&&(e(!0),clearTimeout(n)),s}catch{return!1}}return{subscribe:t,check:o}}function E(e,t){return e.origin!==h||!e.pathname.startsWith(t)}function N(e){e.client}const P={url:p({}),page:p({}),navigating:u(null),updated:w()};export{I,f as P,T as S,R as a,U as b,L as c,P as d,k as e,O as f,S as g,N as h,E as i,h as o,x as s};
