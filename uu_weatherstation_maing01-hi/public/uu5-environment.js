!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}({"../env/development.json":function(e){e.exports=JSON.parse('{"port":1234,"autoOpenInBrowser":false,"basePath":"/uu5-tutorial-maing02/0/","useMockData":true,"uu5Environment":{"uu5g05_trustedUriRegExp":"^https?://localhost(:[0-9]+)?/|^https://([a-z][a-z0-9\\\\-]{0,61}[a-z0-9][.]|[a-z][.])?plus4u[.]net(:[0-9]+)?(?=[/#?]|$)","callsBaseUri":"https://uuapp.plus4u.net/uu-jokes-maing01/4ef6a7b01b5942ecbfb925b249af987f/"}}')},"../env/production.json":function(e){e.exports=JSON.parse('{"uu5Environment":{}}')},"../target/webpack-tmp/uu5-environment.js":function(e,n,t){var r=t("../env/development.json").uu5Environment,o=t("../env/production.json").uu5Environment||{};if(r)for(var u in r)o[u]=r[u];window.UU5={Environment:o}},0:function(e,n,t){e.exports=t("../target/webpack-tmp/uu5-environment.js")}});