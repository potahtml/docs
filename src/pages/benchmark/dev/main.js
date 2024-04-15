!function(){"use strict";const e=globalThis,t=e.Symbol,n=e.Object,s=n.assign,o=e=>"function"==typeof e,r=t(),i=t(),c=t(),l=t(),u="http://www.w3.org/",a={__proto__:null,svg:u+"2000/svg",math:u+"1998/Math/MathML",html:u+"1999/xhtml",xlink:u+"1999/xlink"};const d=0,h=1,f=2;let p,b,v=null,g=null,m=0;class w{owner;owned;cleanups;context;constructor(e){this.owner=e,this.context=e?.context}dispose(){let e;const{owned:t,cleanups:n}=this;if(t){for(e=t.length-1;e>=0;e--)t[e].dispose();t.length=0}if(n){for(e=n.length-1;e>=0;e--)n[e]();n.length=0}}}class y extends w{state=h;updatedAt=0;fn;sources;sourceSlots;constructor(e,t){super(e),this.fn=t,e&&(e.owned?e.owned.push(this):e.owned=[this])}update(){this.dispose();const e=m,t=p,n=b;b=p=this;try{this.fn()}catch(t){throw this.updatedAt=e+1,t}finally{p=t,b=n}this.updatedAt<=e&&(this.updatedAt=e)}dispose(){const{sources:e,sourceSlots:t}=this;if(e){let n,s,o,r,i;for(;e.length;)n=e.pop(),s=n.observers,o=t.pop(),s&&s.length&&(r=s.pop(),i=n.observerSlots.pop(),o<s.length&&(r.sourceSlots[i]=o,s[o]=r,n.observerSlots[o]=i))}super.dispose(),this.state=d}}class x extends y{user=!0;constructor(e,t){super(e,t),g?g.push(this):L((()=>this.update()))}}class S extends y{constructor(e,t){super(e,t),L((()=>this.update()))}}class k{value;observers;observerSlots;constructor(e,t){var n;this.value=e,t&&(s(this,t),this.save&&(this.prev=e)),this.read=((n=this.read.bind(this))[c]=void 0,n),this.write=this.write.bind(this),this.update=this.update.bind(this)}read(){if(b){const e=this.observers?this.observers.length:0;b.sources?(b.sources.push(this),b.sourceSlots.push(e)):(b.sources=[this],b.sourceSlots=[e]),this.observers?(this.observers.push(b),this.observerSlots.push(b.sources.length-1)):(this.observers=[b],this.observerSlots=[b.sources.length-1])}return this.value}write(e){return(!1===this.equals||!this.equals(this.value,e))&&(this.save&&(this.prev=this.value),this.value=e,this.observers&&this.observers.length&&E((()=>{for(let e,t=0;t<this.observers.length;t++)e=this.observers[t],e.state===d&&(e.pure?v.push(e):g.push(e),e.observers&&j(e)),e.state=h})),!0)}update(e){return"function"==typeof e&&(e=e(this.value)),this.write(e)}equals(e,t){return e===t}*[t.iterator](){yield this.read,yield this.write,yield this.update}}function A(e){const t=p,n=b,s=new w(p);p=s,b=void 0;try{return E((()=>e(s.dispose.bind(s))),!0)}finally{p=t,b=n}}function C(e,t=void 0){return new k(e,t)}function M(e){return new x(p,e)}const L=E;function N(e){return p&&(p.cleanups?p.cleanups.push(e):p.cleanups=[e]),e}function I(e){switch(e.state){case d:return;case f:return T(e)}const t=[];do{e.state&&t.push(e),e=e.owner}while(e&&e.updatedAt<m);for(let n,s=t.length-1;s>=0;s--)switch((e=t[s]).state){case h:e.update();break;case f:n=v,v=null,E((()=>T(e,t[0]))),v=n}}function E(e,t=!1){if(v)return e();let n=!1;t||(v=[]),g?n=!0:g=[],m++;try{const t=e();if(v&&(!function(e){for(let t=0;t<e.length;t++)I(e[t])}(v),v=null),!n){const e=g;g=null,e.length&&E((()=>function(e){let t,n,s=0;for(t=0;t<e.length;t++)n=e[t],n.user?e[s++]=n:I(n);for(t=0;t<s;t++)I(e[t])}(e)))}return t}catch(e){throw n||(g=null),v=null,e}}function T(e,t){e.state=d;for(let n,s=0;s<e.sources.length;s++)if(n=e.sources[s],n.sources)switch(n.state){case h:n!==t&&n.updatedAt<m&&I(n);break;case f:T(n,t)}}function j(e){for(let t,n=0;n<e.observers.length;n++)t=e.observers[n],t.state===d&&(t.state=f,t.pure?v.push(t):g.push(t),t.observers&&j(t))}function q(e=void 0){const n=t();return D.bind(null,n,e)}function D(e,t,n,s){if(void 0===n)return p?.context&&void 0!==p.context[e]?p.context[e]:t;{let t;return function(e){new S(p,e)}((()=>{p.context={...p.context,[e]:n},t=s()})),t}}const O=()=>{const e=p;return t=>o(t)?function(e,t){const n=p,s=b;p=e,b=void 0;try{return E(t,!0)}catch(e){throw e}finally{p=n,b=s}}(e,t):t},R=e=>{for(;"function"==typeof e;)e=e();return e},_=n.groupBy;function P(e,t){const n=e.indexOf(t);return-1!==n&&e.splice(n,1),e}function U(e){const{begin:t,end:n}=e,s=[t];let o=t;for(;o!==n;)o=o.nextSibling,s.push(o);return s}const W=(e,t)=>o(e)?M((()=>{t(R(e))})):t(e),B=Array.isArray,F=(e,...t)=>B(e)?e[0](...t,...e.slice(1)):e(...t),H=e=>null!==e&&"object"==typeof e,K=n.create.bind(null,null),z=e=>1===e.length?e[0]:e,J=n.freeze,G=e=>null==e,Q=t.iterator;function V(e){const t=performance.now();return e(),performance.now()-t}const X=queueMicrotask,Y=J(K()),Z=JSON.stringify,$=Array.from,ee=e=>o(e)&&c in e,te=e=>o(e)&&r in e,ne=e=>!ee(e)&&(o(e)||!B(e)&&H(e)&&!e.then);function se(e){return e[r]=void 0,e}let oe,re;const ie=[];function ce(){re=[[],[],[]],oe=!1}function le(e,t){oe||(oe=!0,X(ue)),re[e].push(t)}function ue(){const e=re;ce();for(const t of e)for(const e of t)F(e);for(const e of ie)F(e)}ce();const ae=e=>le(1,e),de=K(),he=K(),fe=(e,t,n=!0)=>{be(de,e,t,n)},pe=(e,t,n=!0)=>{be(he,e,t,n)},be=(e,t,n,s)=>{e[t]=s?(...e)=>{const t=O();X((()=>t((()=>n(...e)))))}:n},ve=(e,t,n={bubbles:!0,cancelable:!0,composed:!0})=>e.dispatchEvent(new CustomEvent(t,n)),ge=(e,t,n)=>W(n,(n=>me(e,t,n)));function me(e,t,n){G(n)?e[t]=null:e[t]=n,"value"===t&&(ve(e,"input"),ve(e,"change"))}const we=(e,t,n,s)=>W(n,(n=>ye(e,t,n,s)));function ye(e,t,n,s){G(n)?s&&a[s]?e.removeAttributeNS(a[s],t):e.removeAttribute(t):s&&a[s]?e.setAttributeNS(a[s],t,n):e.setAttribute(t,n)}const xe=(e,t,n)=>W(n,(n=>Se(e,t,n))),Se=(e,t,n)=>n?e.setAttribute(t,""):e.removeAttribute(t);function ke(e,t){if(H(t)){let n;for(n in t)Ae(e,n,t[n]);return}const n=typeof t;"string"!==n?"function"!==n||M((()=>{ke(e,R(t))})):e.cssText=t}const Ae=(e,t,n)=>W(n,(n=>Ce(e,t,n))),Ce=(e,t,n)=>G(n)?e.removeProperty(t):e.setProperty(t,n);function Me(e,t){switch(typeof t){case"string":Ne(e,t,!0);break;case"object":{let n;for(n in t)Le(e,n,t[n]);break}case"function":W(t,(t=>Me(e,t)))}}const Le=(e,t,n)=>W(n,(n=>Ne(e,t,n))),Ne=(e,t,n)=>n?e.classList.add(...t.trim().split(/\s+/)):e.classList.remove(t),Ie=(e,t,n,s)=>n(e),Ee=(e,t,n,s)=>le(0,[n,e]),Te=(e,t,n,s)=>N((()=>n(e))),je=K();function qe(e){return e in je||(e.startsWith("on")&&e.toLowerCase()in window?je[e]=e.slice(2).toLowerCase():je[e]=void 0),je[e]}function De(e,t,n){e.addEventListener(t,n,o(n)?void 0:n);const s=()=>function(e,t,n){return e.removeEventListener(t,n),()=>De(e,t,n)}(e,t,n);return N(s),s}const Oe=(e,t,n,s)=>W(n,(n=>Re(e,t,n,s))),Re=(e,t,n,s)=>{H(n)?me(e,t,n):"boolean"!=typeof n||t.includes("-")?(ye(e,t,n,s),G(n)&&me(e,t,n)):me(e,t,n)};fe("style",((e,t,n,s)=>ke(e.style,n)),!1),pe("style",((e,t,n,s,o,r)=>ke(e.style,H(n)?n:{[o]:n})),!1),pe("var",((e,t,n,s,o,r)=>ke(e.style,{["--"+o]:n})),!1),fe("class",((e,t,n,s)=>(e=>"string"==typeof e)(n)?e.setAttribute("class",n):Me(e,n)),!1),pe("class",((e,t,n,s,o,r)=>H(n)?Me(e,n):Le(e,o,n)),!1);for(const e of["value","textContent","innerText","innerHTML"])fe(e,ge,!1);pe("prop",((e,t,n,s,o,r)=>ge(e,o,n)),!1),pe("attr",((e,t,n,s,o,r)=>we(e,o,n)),!1),pe("bool",((e,t,n,s,o,r)=>xe(e,o,n)),!1),fe("onMount",Ee,!1),pe("onMount",Ee,!1),fe("onUnmount",Te,!1),pe("onUnmount",Te,!1),fe("ref",Ie,!1),pe("ref",Ie,!1),pe("on",((e,t,n,s,o,r)=>De(e,o,n)),!1);const _e=(e,t)=>"is"in t||e.localName?.includes("-");const Pe=e=>document[e].bind(document),Ue=Pe("createElement"),We=Pe("createElementNS"),Be=Pe("createTextNode"),Fe=document.adoptedStyleSheets;function He(e=[],t=[]){t=B(t)?t.flat(1/0):[t];for(let n,s=0;s<e.length;s++)n=e[s],n&&(0===t.length||!t.includes(n))&&n.remove();return t}const Ke=new Map,ze=new WeakMap,Je=new Map,Ge=function(e){const t=q(e);return t.Provider=e=>t(e.value,(()=>lt(e.children))),t}(),Qe=t();function Ve(e,t){return e===Qe?t.children:(J(t),void 0===t?Xe(e):se(Xe(e).bind(null,t)))}function Xe(e){if(te(e))return e;const t=H(e);let n=t?ze.get(e):Ke.get(e);if(n)return n;switch(typeof e){case"string":n=$e.bind(null,e);break;case"function":if(i in e){n=Ye.bind(null,e);break}if(ee(e)){n=Ze.bind(null,e);break}n=e;break;default:if(e instanceof Node){n=st.bind(null,e);break}n=Ze.bind(null,e)}return t?ze.set(e,n):Ke.set(e,n),se(n)}function Ye(e,t){const n=new e;return n.ready&&ae(n.ready.bind(n)),n.cleanup&&N(n.cleanup.bind(n)),n.render(t)}function Ze(e,t){return e}function $e(e,t){const n=t?.xmlns||a[e],s=Ge();return n&&n!==s?Ge(n,(()=>st(We(n,e),t))):s&&"foreignObject"===e?Ge(a.html,(()=>st(We(s,e),t))):st(s?We(s,e):Ue(e),t)}function et(e,t){return se((()=>function(e,t){tt||(tt=!0,queueMicrotask((()=>{tt=!1,Je.clear()})));const n=Je.get(e);if(n)return st(n.cloneNode(!0),t);const s=t?.xmlns,o=Ge();if(s&&s!==o)return Ge(s,(()=>nt(e,t,s)));return nt(e,t,o)}(e,t)))}let tt=!1;function nt(e,t,n){let s=n?We(n,"template"):Ue("template");s.innerHTML=e,s=n?s:s.content;const o=1===s.childNodes.length?s.firstChild:s;return Je.set(e,o),st(o.cloneNode(!0),t)}function st(e,t){return t&&function(e,t){let n,s;for(n in t){if(s=t[n],n in de){de[n](e,n,s,t);continue}let o=qe(n);if(o)De(e,o,s);else if(n.includes(":")){let[r,i]=n.split(":");if(r in he){he[r](e,n,s,t,i,r);continue}if(o=qe(r),o){De(e,o,s);continue}_e(e,t)?me(e,n,s):Oe(e,n,s,r)}else _e(e,t)?me(e,n,s):Oe(e,n,s)}}(e,t),e}function ot(e,t,n){switch(typeof t){case"string":case"number":return ct(e,Be(t),n);case"function":{if(te(t))return ot(e,function(e){if(void 0===b)return e();const t=b;b=void 0;try{return e()}finally{b=t}}(t),n);let s=[];return e=rt(e,void 0,n),l in t?(M((()=>{s=He(s,t((t=>{const n=rt(e,void 0,!0),s=rt(e,void 0,!0);return[n,ot(s,t,!0),s]})))})),N((()=>{He(s),e.remove()})),[s,e]):(M((()=>{s=He(s,ot(e,t(),!0))})),N((()=>{He(s),e.remove()})),[s,e])}case"object":if(B(t))return 1===t.length?ot(e,t[0],n):t.map((t=>ot(e,t,n)));if(t instanceof Node)return t instanceof DocumentFragment?ot(e,$(t.childNodes),n):ct(e,t,n);if(null===t)return;if("then"in t){const[s,o]=C(void 0),r=t=>e.isConnected&&o(t);return t.then(r).catch(r),ot(e,s,n)}return Q in t?ot(e,$(t.values()),n):t instanceof CSSStyleSheet?(Fe.push(t),N((()=>P(Fe,t))),null):ot(e,"toString"in t?t.toString():Z(t),n);case"undefined":return;default:return ct(e,Be(t.toString()),n)}}fe("children",((e,t,n)=>ot(e,n)),!1);const rt=(e,t,n)=>ct(e,Be(""),n);let it;function ct(e,t,n){if(e===document.head){if(!it){const e=document.head;it=e.querySelector.bind(e)}const n=t.tagName;let s;"TITLE"===n?s=it("title"):"META"===n?s=it('meta[name="'+t.getAttribute("name")+'"]')||it('meta[property="'+t.getAttribute("property")+'"]'):"LINK"===n&&"canonical"===t.rel&&(s=it('link[rel="canonical"]')),s?s.replaceWith(t):e.appendChild(t)}else n?e.before(t):e.appendChild(t);return t}const lt=e=>z(function(e){const t=new DocumentFragment;return ot(t,e),t}(e).childNodes);const ut=e=>o(e)?ee(e)?t=>{const n=e();return o(n)?ee(n)?n():n(...t):n}:t=>e(...t):()=>e;K();const at=e=>function(e,t,n){const s=new Map,o=new Map;let r=0,i=[],c=[];function u(){for(let e=0;e<c.length;e++)c[e].dispose(!0);s.clear(),o.clear(),i.length=0,c.length=0}N(u);class a{constructor(e,t,n,s){this.runId=-1,this.item=e,this.index=t,this.isDupe=s,this.disposer=void 0,this.nodes=A((s=>(this.disposer=s,n(e,t))))}get begin(){return this.nodes[0]}get end(){return this.nodes[this.nodes.length-1]}dispose(e){if(void 0===e)if(this.isDupe){const e=o.get(this.item);1===e.length?o.delete(this.item):P(e,this)}else s.delete(this.item);this.disposer()}}function d(l){const d=l?(e,n)=>l(t(e,n),n):t,h=(R(e)||[]).entries();r++,i=[];const f=c.length;for(const[e,t]of h){let n=f?s.get(t):void 0;if(void 0===n)n=new a(t,e,d,!1),s.set(t,n);else if(n.runId===r){let s=o.get(t);s||(s=[],o.set(t,s));for(let e=0;e<s.length;e++)if(s[e].runId!==r){n=s[e];break}n.runId===r&&(n=new a(t,e,d,!0),s.push(n))}n.runId=r,n.index=e,i.push(n)}if(0===i.length)u();else for(let e=0;e<c.length;e++)c[e].runId!==r&&c[e].dispose();if(n&&i.length>1&&c.length){const{a:e,b:t}=_(i,((e,t)=>i[t]===c[t]?"a":"b"));if(e&&t&&e.length&&t.length&&t.length<e.length&&t.every((e=>c.includes(e))))for(const n of t)for(const t of e){if(n.index===t.index-1){t.begin.before(...U(n));break}if(n.index===t.index+1){t.end.after(...U(n));break}}let n=i[i.length-1];for(let e=i.length-1;e>0;e--){const t=i[e-1];n.begin.previousSibling!==t.end&&n.begin.before(...U(t)),n=t}}return c=i,i.map((e=>e.nodes))}return d[l]=void 0,d}(e.each,function(e){e=B(e)?z(e):e;const t=B(e)?e.map(ut):ut(e);return B(e)?se(((...e)=>t.map((t=>t(e))))):se(((...e)=>t(e)))}(e.children),!0);let dt=1;function ht(e){let t=new Array(e);for(let n=0;n<e;n++){const[e,s,o]=C("elegant green keyboard "+dt++);t[n]={id:dt,label:e,updateLabel:o}}return t}const ft=({id:e,text:t,fn:n})=>et('<div class="col-sm-6 smallpad"></div>',{children:et('<button class="btn btn-primary btn-block" type=button></button>',{id:e,onClick:n,children:t})});!function(e,t,n=Y){const s=A((s=>(function(e,t=document.body,n){n.clear&&t&&(t.textContent="");const s=ot(t,ne(e)?Xe(e):e,n.relative);N((()=>He([s].flat(1/0))))}(e,t,n),s)));N(s)}((()=>{const[e,t,n]=C([]),[s,o]=C(null),r=function(e){const t=new Map;let n;return M((()=>{const s=e();if(s===n)return;const o=t.get(n);o&&o.write(!1);const r=t.get(s);r&&r.write(!0),n=s})),function(n){let s=t.get(n);return s||(s=C(n===e()),s.counter=0,t.set(n,s)),s.counter++,N((()=>{0==--s.counter&&t.delete(n)})),s.read}}(s);return et("<div class=container></div>",{children:[et("<div class=jumbotron></div>",{children:et("<div class=row><div class=col-md-6><h1>pota Keyed</h1></div></div>",{children:et("<div class=col-md-6></div>",{children:et("<div class=row></div>",{children:[Ve(ft,{id:"run",text:"Create 1,000 rows",fn:()=>t(ht(1e3))}),Ve(ft,{id:"runlots",text:"Create 10,000 rows",fn:()=>{t(ht(1e4))}}),Ve(ft,{id:"add",text:"Append 1,000 rows",fn:()=>n((e=>[...e,...ht(1e3)]))}),Ve(ft,{id:"update",text:"Update every 10th row",fn:()=>L((()=>{for(let t=0,n=e(),s=n.length;t<s;t+=10)n[t].updateLabel((e=>e+" !!!"))}))}),Ve(ft,{id:"clear",text:"Clear",fn:()=>t([])}),Ve(ft,{id:"swaprows",text:"Swap Rows",fn:()=>{const n=e().slice();if(n.length>998){let e=n[1];n[1]=n[998],n[998]=e,t(n)}}}),Ve(ft,{id:"bench",text:"bench",fn:()=>{for(let e=0;e<5;e++)t(ht(1e4)),t([]);let e=0,n=0,s=0,o=0;for(let s=0;s<10;s++)e+=V((()=>t(ht(1e4)))),n+=V((()=>t([]))),console.log(s+" createLarge",e/(s+1),s+" clearLarge",n/(s+1));console.log("------------");for(let e=0;e<10;e++)s+=V((()=>t(ht(1e3)))),o+=V((()=>t([]))),console.log(e+" createSmall",s/(e+1),e+" clearSmall",o/(e+1))}})]})})})}),et('<table class="table table-hover table-striped test-data"></table>',{onClick:e=>{const t=e.target;var s;void 0!==t.setSelected?o(t.setSelected):void 0!==t.removeRow&&(s=t.removeRow,n((e=>{const t=e.findIndex((e=>e.id===s));return e.splice(t,1),[...e]})))},children:et("<tbody></tbody>",{children:Ve(at,{each:e,children:e=>{const{id:t,label:n}=e;return et("<tr></tr>",{"class:danger":r(t),children:[et("<td class=col-md-1></td>",{textContent:t}),et("<td class=col-md-4></td>",{children:et("<a></a>",{textContent:n,"prop:setSelected":t})}),et("<td class=col-md-1></td>",{children:et("<a></a>",{children:et('<span class="glyphicon glyphicon-remove" aria-hidden=true></span>',{"prop:removeRow":t})})}),et("<td class=col-md-6></td>")]})}})})}),et('<span class="preloadicon glyphicon glyphicon-remove" aria-hidden=true></span>')]})}),document.getElementById("main"))}();
//# sourceMappingURL=main.js.map
