if(!self.define){let e,i={};const a=(a,n)=>(a=new URL(a+".js",n).href,i[a]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=i,document.head.appendChild(e)}else e=a,importScripts(a),i()})).then((()=>{let e=i[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,c)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let r={};const f=e=>a(e,s),o={module:{uri:s},exports:r,require:f};i[s]=Promise.all(n.map((e=>o[e]||f(e)))).then((e=>(c(...e),r)))}}define(["./workbox-17c5f633"],(function(e){"use strict";e.setCacheNameDetails({prefix:"1h5n4j5es"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.655657b1.css",revision:null},{url:"assets/index.b2703f18.js",revision:null},{url:"assets/playfair-display-v20-latin-regular.0f538c91.svg",revision:null},{url:"assets/quattrocento-v11-latin-regular.993fa77e.svg",revision:null},{url:"favicon-16x16.png",revision:"817ddca3b73c62da1dff4d4699bbc0bd"},{url:"favicon-32x32.png",revision:"9ac7816e942f0ebd0ec5ab1668e4e9e5"},{url:"favicon.ico",revision:"e97f2fcdc4263fdd8654c5806dc7ec15"},{url:"images/aiTreeGhibli.png",revision:"b383009bb0ba2f9c3343a2bd1ac7ab9c"},{url:"images/balloon1.png",revision:"61c02f2c89d83da8400bfff1c8ff53cf"},{url:"images/balloon2.png",revision:"cc8d179ade68713f1943e8fe0767fb11"},{url:"images/cloud1.png",revision:"2beaf946887af2592987d98ca781542b"},{url:"images/cloud2.png",revision:"7e35dc826a34cad66c7f5506259f3c39"},{url:"images/firefly1.png",revision:"d64ac38987e7ed79041716e42146b917"},{url:"images/firefly2.png",revision:"1d1aad27243f52d6f8545372cc741b2e"},{url:"images/nyoibo1.png",revision:"ffd57d4859ced830c7b525962872c051"},{url:"images/nyoibo2.png",revision:"b5b8b0ce4ce7b40fdd794889fff9ee13"},{url:"images/pwa/apple-touch-icon-114x114.png",revision:"1bae7acb1d71b81de42064a009de43dc"},{url:"images/pwa/apple-touch-icon-120x120.png",revision:"4ab165464ac0f190ade0180ccea22d82"},{url:"images/pwa/apple-touch-icon-144x144.png",revision:"ba8e785d63e256645f2cdbf728a6483b"},{url:"images/pwa/apple-touch-icon-152x152.png",revision:"5f4c39c99cb8644e75882cc57a8749a3"},{url:"images/pwa/apple-touch-icon-180x180.png",revision:"5a3fe0f27027ba550d0475eb8c6e1083"},{url:"images/pwa/apple-touch-icon-57x57.png",revision:"51f2e4b08aca6249bd05f711662930c1"},{url:"images/pwa/apple-touch-icon-60x60.png",revision:"6d2881d2e49fa64922db5d44db6a2827"},{url:"images/pwa/apple-touch-icon-72x72.png",revision:"a092050e09da46397b8f3af0893eba57"},{url:"images/pwa/apple-touch-icon-76x76.png",revision:"9df2c937a13db275941400381e7fb023"},{url:"images/pwa/apple-touch-icon.png",revision:"5a3fe0f27027ba550d0475eb8c6e1083"},{url:"images/pwa/mstile-150x150.png",revision:"871a5543ecbc685f1e4ac5f02b2a34e1"},{url:"images/pwa/pwa-144x144.png",revision:"43e9f5f8b38293bbfd867d7bf83e399b"},{url:"images/pwa/pwa-192x192.png",revision:"79a436c420df9f94aa334832635e7928"},{url:"images/pwa/pwa-256x256.png",revision:"27d04cabea7e4458332c3e9daa556af7"},{url:"images/pwa/pwa-36x36.png",revision:"183e5c5330560bfb21fb8b8e32c6ae33"},{url:"images/pwa/pwa-384x384.png",revision:"5b6faa0542704025efcdacdfe152467a"},{url:"images/pwa/pwa-48x48.png",revision:"8536c8dc79c56cd20186f671801938fb"},{url:"images/pwa/pwa-512x512.png",revision:"8e844fd4e5551d0b1e3e32272f0e6528"},{url:"images/pwa/pwa-72x72.png",revision:"8053fe49f252a54b86af9a85c1603dac"},{url:"images/pwa/pwa-96x96.png",revision:"e80909e23a592e7b8454611ad4383cb9"},{url:"images/pwa/safari-pinned-tab.svg",revision:"13f85a003b73eff9274eb0f585331009"},{url:"images/sparks1.png",revision:"5f62c23cbf469b12a4ad39bc9617bbbd"},{url:"images/sparks2.png",revision:"339cb051fe3b42e3dcb99272d1aa1102"},{url:"index.html",revision:"33881d2da3725cbcecd5a6b8dc172197"},{url:"offline.html",revision:"a003ba854e1732c1d4a092b796f322f1"},{url:"favicon.ico",revision:"e97f2fcdc4263fdd8654c5806dc7ec15"},{url:"robots.txt",revision:"f77c87f977e0fcce05a6df46c885a129"},{url:"manifest.webmanifest",revision:"cd4c6bb8b82fbec9b843562941dd5bb7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));