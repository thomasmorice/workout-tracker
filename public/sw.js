if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>i(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/221-1a756f71b0897f48.js",revision:"1a756f71b0897f48"},{url:"/_next/static/chunks/301-04dd6dd8a24d996b.js",revision:"04dd6dd8a24d996b"},{url:"/_next/static/chunks/3fff1979-2745cb18e8e4fee3.js",revision:"2745cb18e8e4fee3"},{url:"/_next/static/chunks/992-f0268e1bd21ee6ea.js",revision:"f0268e1bd21ee6ea"},{url:"/_next/static/chunks/9a1974b2-bbf657e2d7a15022.js",revision:"bbf657e2d7a15022"},{url:"/_next/static/chunks/ae51ba48-02d348d21832325a.js",revision:"02d348d21832325a"},{url:"/_next/static/chunks/ea88be26-3cdde98635804176.js",revision:"3cdde98635804176"},{url:"/_next/static/chunks/framework-2c79e2a64abdb08b.js",revision:"2c79e2a64abdb08b"},{url:"/_next/static/chunks/main-8ed7770c2cd629d9.js",revision:"8ed7770c2cd629d9"},{url:"/_next/static/chunks/pages/_app-9d045c74b2fe5d2c.js",revision:"9d045c74b2fe5d2c"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/activities-212ef33794c8fdc9.js",revision:"212ef33794c8fdc9"},{url:"/_next/static/chunks/pages/index-d9726d539b1c1701.js",revision:"d9726d539b1c1701"},{url:"/_next/static/chunks/pages/profile-3005487eaaa0148e.js",revision:"3005487eaaa0148e"},{url:"/_next/static/chunks/pages/session/edit/%5Bid%5D-345db6e519cea61f.js",revision:"345db6e519cea61f"},{url:"/_next/static/chunks/pages/workout/%5Bid%5D-b4459b9924f1e862.js",revision:"b4459b9924f1e862"},{url:"/_next/static/chunks/pages/workouts-663412ee363c3520.js",revision:"663412ee363c3520"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-60d328ea1049e7c2.js",revision:"60d328ea1049e7c2"},{url:"/_next/static/css/cc631ca71943ced0.css",revision:"cc631ca71943ced0"},{url:"/_next/static/rVsNkLmQMo4Z4_BxPWFvh/_buildManifest.js",revision:"d7f293a1b8fefa53834db83c9766967e"},{url:"/_next/static/rVsNkLmQMo4Z4_BxPWFvh/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android-chrome-192x192.png",revision:"a18e80b74e8032ec77134802d16a2991"},{url:"/android-chrome-512x512.png",revision:"e0ac23321a4446fe0f9e77bd6ab058cb"},{url:"/apple-touch-icon.png",revision:"9a5d1c958735ea2a0032bea22bf40f09"},{url:"/browserconfig.xml",revision:"bc20c9f8e71e062bcf006478b1bf873c"},{url:"/favicon-16x16.png",revision:"61c856dd29d7537bc030c400de735cf9"},{url:"/favicon-32x32.png",revision:"a956b4014c75e179e0b8e2d64cd3c68c"},{url:"/favicon.ico",revision:"6b82348d48579c7e660f92cee1760f79"},{url:"/gorilla-logo-transparent.png",revision:"e32979a1ae1d0b471fa6da4fb6800137"},{url:"/logo-no-text.png",revision:"21c0b5c45c94bb31338680582b547720"},{url:"/logo-white.svg",revision:"1e8748717edf1104d2714acaf44080a1"},{url:"/manifest-staging.json",revision:"24698a3bb31de2e17e9c76298d872bc2"},{url:"/manifest.json",revision:"145a41c351a0dc0073b7b4c9442cb0d9"},{url:"/mstile-150x150.png",revision:"6476ad93607b610387198f16e4c68ca8"},{url:"/safari-pinned-tab.svg",revision:"f0d7227b022ae6c2214871f9191f2dfe"},{url:"/site.webmanifest",revision:"2064d113b57a8e93b1e1be87eef721c2"},{url:"/workout-bg.avif",revision:"15af9f652e486d96b5801143cf7ab8c3"},{url:"/workout-item/casual-talk-2.png",revision:"1a5b96be767b1302173d75487d2bdd68"},{url:"/workout-item/casual-talk.png",revision:"d7d39e704524a7c938795486e70ec02a"},{url:"/workout-item/done-workout.png",revision:"dc69f0e0c05d55feb0278463901ed8df"},{url:"/workout-item/frontsquat.png",revision:"e9958c5fcffeda5323f9536cd18b5efd"},{url:"/workout-item/jumping-rope-2.png",revision:"ea980f3c6c010eda7d12b731c1f7f0d4"},{url:"/workout-item/jumping-rope.png",revision:"43c7430f59ff5527bb8d1a1b9bf7ed6d"},{url:"/workout-item/kettlebell-swing-2.png",revision:"5250df5bb7f5792f95876b88f3ec68fe"},{url:"/workout-item/kettlebell-swing.png",revision:"9dbb72eed94ab08ed6e237910123f2dc"},{url:"/workout-item/powersnatch.png",revision:"1f436dad0263b137ce3324b8c01cc6a6"},{url:"/workout-item/preparing-workout-2.png",revision:"42db03c0ef1d88478b1a556dcea22a00"},{url:"/workout-item/preparing-workout-3.png",revision:"1adb989ba9d72e831456e8140fe2e96a"},{url:"/workout-item/preparing-workout-4.png",revision:"720bb7169ab65cc466be3c85fb9453e0"},{url:"/workout-item/preparing-workout-5.png",revision:"8d5384b3af979659610f8bf9f16497fd"},{url:"/workout-item/preparing-workout-6.png",revision:"0d716bb9bcd2e36957cc7fabbe76b08f"},{url:"/workout-item/preparing-workout.png",revision:"042f10f7a7629867b73c299f70f89c36"},{url:"/workout-item/pushup-2.png",revision:"7adca44eeecfe8eef8fccf9ea88d4089"},{url:"/workout-item/pushup.png",revision:"49ef7cbb054ce5d6c2f8c1afad0e4d7f"},{url:"/workout-item/rower.png",revision:"93d6aa9b99d482edec196fa4ac279fa5"},{url:"/workout-item/walking-into-the-gym.png",revision:"33012df50f1c7fcce0a68e8b567c799e"},{url:"/workout-item/wallballs.png",revision:"830b35b1991156209270a30dbf01836b"},{url:"/workout-item/woman-with-bands.png",revision:"5ca08dccbd7a3fffe4a49f062950fb2d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
