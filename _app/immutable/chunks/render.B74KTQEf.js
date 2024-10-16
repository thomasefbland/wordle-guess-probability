import{l as I,v as O,w as R,x as M,y as b,z as V,H as B,A as C,B as m,C as E,D as N,E as H,F as y,G as W,I as P,J as Y,K as q,L as z,M as G,N as $,O as j,p as F,P as T,Q as J,a as K,d as Q}from"./runtime.BdlKBIdT.js";import{b as U}from"./disclose-version.BI7fLC5u.js";const k=new Set,L=new Set;function x(t,e,a,s){function o(r){if(s.capture||g.call(e,r),!r.cancelBubble)return a.call(this,r)}return t.startsWith("pointer")||t.startsWith("touch")||t==="wheel"?O(()=>{e.addEventListener(t,o,s)}):e.addEventListener(t,o,s),o}function ot(t,e,a,s,o){var r={capture:s,passive:o},d=x(t,e,a,r);(e===document.body||e===window||e===document)&&I(()=>{e.removeEventListener(t,d,r)})}function it(t){for(var e=0;e<t.length;e++)k.add(t[e]);for(var a of L)a(t)}function g(t){var A;var e=this,a=e.ownerDocument,s=t.type,o=((A=t.composedPath)==null?void 0:A.call(t))||[],r=o[0]||t.target,d=0,_=t.__root;if(_){var c=o.indexOf(_);if(c!==-1&&(e===document||e===window)){t.__root=e;return}var l=o.indexOf(e);if(l===-1)return;c<=l&&(d=c)}if(r=o[d]||t.target,r!==e){R(t,"currentTarget",{configurable:!0,get(){return r||a}});try{for(var p,u=[];r!==null;){var i=r.assignedSlot||r.parentNode||r.host||null;try{var n=r["__"+s];if(n!==void 0&&!r.disabled)if(M(n)){var[f,...v]=n;f.apply(r,[t,...v])}else n.call(r,t)}catch(w){p?u.push(w):p=w}if(t.cancelBubble||i===e||i===null)break;r=i}if(p){for(let w of u)queueMicrotask(()=>{throw w});throw p}}finally{t.__root=e,delete t.currentTarget}}}function st(t){return t.endsWith("capture")&&t!=="gotpointercapture"&&t!=="lostpointercapture"}const X=["beforeinput","click","change","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"];function ut(t){return X.includes(t)}const Z={formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly"};function dt(t){return t=t.toLowerCase(),Z[t]??t}const tt=["touchstart","touchmove"];function et(t){return tt.includes(t)}function ct(t,e){var a=e==null?"":typeof e=="object"?e+"":e;a!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=a,t.nodeValue=a==null?"":a+"")}function rt(t,e){return D(t,e)}function lt(t,e){b(),e.intro=e.intro??!1;const a=e.target,s=T,o=y;try{for(var r=V(a);r&&(r.nodeType!==8||r.data!==B);)r=C(r);if(!r)throw m;E(!0),N(r),H();const d=D(t,{...e,anchor:r});if(y===null||y.nodeType!==8||y.data!==W)throw P(),m;return E(!1),d}catch(d){if(d===m)return e.recover===!1&&Y(),b(),q(a),E(!1),rt(t,e);throw d}finally{E(s),N(o)}}const h=new Map;function D(t,{target:e,anchor:a,props:s={},events:o,context:r,intro:d=!0}){b();var _=new Set,c=u=>{for(var i=0;i<u.length;i++){var n=u[i];if(!_.has(n)){_.add(n);var f=et(n);e.addEventListener(n,g,{passive:f});var v=h.get(n);v===void 0?(document.addEventListener(n,g,{passive:f}),h.set(n,1)):h.set(n,v+1)}}};c(z(k)),L.add(c);var l=void 0,p=G(()=>{var u=a??e.appendChild($());return j(()=>{if(r){F({});var i=Q;i.c=r}o&&(s.$$events=o),T&&U(u,null),l=t(u,s)||{},T&&(J.nodes_end=y),r&&K()}),()=>{var f;for(var i of _){e.removeEventListener(i,g);var n=h.get(i);--n===0?(document.removeEventListener(i,g),h.delete(i)):h.set(i,n)}L.delete(c),S.delete(l),u!==a&&((f=u.parentNode)==null||f.removeChild(u))}});return S.set(l,p),l}let S=new WeakMap;function ft(t){const e=S.get(t);e&&e()}export{ut as a,x as c,it as d,ot as e,lt as h,st as i,rt as m,dt as n,ct as s,ft as u};
