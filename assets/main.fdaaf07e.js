import{v as n}from"./versions.ad323d23.js";document.getElementById("versions").innerHTML=Object.entries(n).map(([o,e])=>{const{rrwebVersion:t}=e,r="default"in e&&e.default;return`<option value="${o}" ${r?"selected":""} =>${o} (rrweb v${t})</option>`}).join("");console.log("Welcome to rrwebdebug.com!");
