var v=Object.defineProperty;var m=(n,t,i)=>t in n?v(n,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[t]=i;var a=(n,t,i)=>(m(n,typeof t!="symbol"?t+"":t,i),i);const g=""+new URL("../assets/a0.dc3c2e85.mp3",import.meta.url).href,G=""+new URL("../assets/a1.1b1ff663.mp3",import.meta.url).href,A=""+new URL("../assets/a2.b8744b82.mp3",import.meta.url).href,B=""+new URL("../assets/a3.09c40d98.mp3",import.meta.url).href,w=""+new URL("../assets/a4.11c384d7.mp3",import.meta.url).href,R=""+new URL("../assets/a5.bc7d85dc.mp3",import.meta.url).href,q=""+new URL("../assets/a6.a39f1834.mp3",import.meta.url).href,L=""+new URL("../assets/a7.0ce83a41.mp3",import.meta.url).href,U=""+new URL("../assets/damper.391ddc72.mp3",import.meta.url).href,F=""+new URL("../assets/Piano Impulse6.43259355.mp3",import.meta.url).href;async function y(n,t){const i=await fetch(n);if(!i.ok)return{err:i.statusText,code:i.status};const s=await i.arrayBuffer();return{data:await t.decodeAudioData(s)}}class T{constructor(t,i,s,e){a(this,"noteA");a(this,"noteB");a(this,"gainA");a(this,"gainB");a(this,"gain");a(this,"biquadFilter");a(this,"damp");this.noteA=i.createBufferSource(),this.noteB=i.createBufferSource(),this.gainA=i.createGain(),this.gainB=i.createGain(),this.gain=i.createGain(),this.biquadFilter=i.createBiquadFilter(),this.biquadFilter.type="lowpass",this.biquadFilter.connect(s),this.gain.connect(this.biquadFilter),this.gainA.connect(this.gain),this.noteA.connect(this.gainA),this.gainB.connect(this.gain),this.noteB.connect(this.gainB),t<90&&(this.damp=i.createBufferSource(),this.damp.buffer=e,this.damp.connect(s))}on(t,i,s,e,h,o,r,c){this.noteA.buffer=t,this.noteA.playbackRate.value=s,this.biquadFilter.frequency.value=h,this.gainA.gain.value=o,this.gain.gain.value=c,i&&(this.noteB.buffer=i,this.noteB.playbackRate.value=e,this.gainB.gain.value=r,this.noteB.start(0)),this.noteA.start(0)}off(t,i,s){var e;this.gain.gain.setTargetAtTime(0,t,i),this.noteA.stop(s),this.noteB.stop(s),(e=this.damp)==null||e.start(0)}}class b{constructor(t){a(this,"context");a(this,"convolver");a(this,"directGain");a(this,"convGain");a(this,"convGainAfter");a(this,"bufferlists",[]);a(this,"damper");a(this,"sus",!1);a(this,"sustained",[]);a(this,"notes",{});return this.context=t,this.convolver=t.createConvolver(),this.directGain=t.createGain(),this.convGain=t.createGain(),this.convGainAfter=t.createGain(),this.convGain.connect(this.convolver),this.convolver.connect(this.convGainAfter),this.convGainAfter.connect(t.destination),this.directGain.connect(t.destination),this.directGain.connect(this.convGain),this.directGain.gain.value=.5,this.convGain.gain.value=0,this.convGainAfter.gain.value=0,this}async load(){const t=[g,G,A,B,w,R,q,L,U,F],i=await Promise.all(t.map(s=>y(s,this.context)));this.bufferlists=[],i.forEach((s,e)=>{"data"in s?(this.bufferlists.push(s.data),e===8?this.damper=s.data:e===9&&(this.convolver.buffer=s.data)):console.error(`Failed to load audio: ${s.err}`)})}noteOn(t,i){if(t<109&&t>20){this.notes[t]&&(this.notes[t].off(this.context.currentTime,1.1,this.context.currentTime+2),this.sustained.splice(this.sustained.indexOf(t),1));const s=Math.floor((t-21)/12),e=s+1,h=s*12+21,o=2**((t-69)/12)*440,r=i/127;let c=o*(2-(t-21)/50)+3*o*r;t<60&&(c=440*(3-(60-21)/50)+3*o*r);const f=2,l=Math.pow(2,(t-h)/12),u=0,d=0,p=r**1.4;this.notes[t]=new T(t,this.context,this.directGain,this.damper),this.notes[t].on(this.bufferlists[s],this.bufferlists[e],l,u,c,f,d,p)}}noteOff(t){this.sus?this.sustained.push(t):(t<90&&this.notes[t].off(this.context.currentTime+.03,.08,this.context.currentTime+2),delete this.notes[t])}sustain(t){if(t==127)this.sus=!0,this.convGain.gain.value=1,this.convGainAfter.gain.value=1;else if(t==0){this.sus=!1,this.convGain.gain.value=0,this.convGainAfter.gain.value=0;for(let i=0;i<this.sustained.length;i++)this.notes[this.sustained[i]]&&this.noteOff(this.sustained[i]);this.sustained.length=0}}}export{b as P};