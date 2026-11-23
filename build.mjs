import { readFileSync, writeFileSync } from "node:fs";
const L = JSON.parse(readFileSync(new URL("./letter.json", import.meta.url), "utf8"));
const CLOSURE_COPY = L.languages, CLOSURE_EMAIL = L.email, CLOSURE_SIGNATURE = L.signature;
const out = new URL("./", import.meta.url).pathname;
const names = { tr:"Türkçe", en:"English", de:"Deutsch", fr:"Français", es:"Español", pt:"Português", it:"Italiano", ru:"Русский" };
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const data = {};
for (const [l,c] of Object.entries(CLOSURE_COPY)) data[l] = { title:c.title, greeting:c.greeting, paragraphs:c.paragraphs, signoff:c.signoff, role:c.role, note:c.note, description:c.description };
const en = CLOSURE_COPY.en;
const noscript = `<p>${esc(en.greeting)}</p>` + en.paragraphs.map(p=>`<p>${esc(p)}</p>`).join("");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(en.title)}</title>
<meta name="description" content="${esc(en.description)}">
<meta name="robots" content="noindex">
<link rel="icon" href="/logo.png">
<style>
:root{--bg:#0d0a1a;--card:#161127;--line:rgba(255,255,255,.08);--text:#ede9f8;--sub:#a79dc4;--muted:#8a80ad;--accent:#a284f2;--accent-l:#c3b0ff}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--sub)}
body{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 16px;font-family:Georgia,"Times New Roman",serif;background:radial-gradient(ellipse at top,#1d1536 0%,var(--bg) 60%) fixed}
.brand{display:flex;align-items:center;gap:8px;margin-bottom:24px;font:600 15px/1 system-ui,-apple-system,sans-serif;color:var(--text)}
article{width:100%;max-width:640px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:32px 24px}
@media(min-width:640px){article{padding:40px}}
h1{margin:0;text-align:center;font-weight:400;font-size:26px;line-height:1.35;color:var(--text)}
.rule{width:64px;height:1px;background:rgba(162,132,242,.4);margin:20px auto 0}
.body{margin-top:28px;font-size:16px;line-height:1.7}
.body p{margin:0 0 16px}
.t{color:var(--text)}
.sign{margin-top:32px;font-size:16px;line-height:1.6}
.sign p{margin:0}
.name{margin-top:4px!important;font-size:17px;font-weight:600;color:var(--text)}
.role{font:13px system-ui,-apple-system,sans-serif;color:var(--muted)}
hr{border:0;border-top:1px solid var(--line);margin:32px 0}
.note{font-size:14px;font-style:italic;line-height:1.6;color:var(--muted);margin:0}
.note a{font-style:normal;color:var(--accent-l);text-decoration:none}
nav{margin-top:24px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;font:12px system-ui,-apple-system,sans-serif}
nav a{color:var(--muted);text-decoration:none}
nav a[aria-current]{color:var(--accent-l)}
</style>
</head>
<body>
<div class="brand" aria-hidden="true"><img src="/logo.png" alt="" width="24" height="24">AstroAk</div>
<article>
<h1 id="title">${esc(en.title)}</h1>
<div class="rule" aria-hidden="true"></div>
<div class="body" id="body">${noscript}</div>
<div class="sign"><p id="signoff">${esc(en.signoff)}</p><p class="name">${esc(CLOSURE_SIGNATURE)}</p><p class="role" id="role">${esc(en.role)}</p></div>
<hr>
<p class="note" id="note"></p>
</article>
<nav id="langs"></nav>
<script>
var D=${JSON.stringify(data)},N=${JSON.stringify(names)},E=${JSON.stringify(CLOSURE_EMAIL)};
function pick(){var s=location.pathname.split("/")[1];if(D[s])return s;var q=new URLSearchParams(location.search).get("lang");if(D[q])return q;var L=navigator.languages||[navigator.language||"en"];for(var i=0;i<L.length;i++){var k=String(L[i]).slice(0,2).toLowerCase();if(D[k])return k}return"en"}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function show(l){var c=D[l];document.documentElement.lang=l;document.title=c.title;
document.getElementById("title").textContent=c.title;
var b=document.getElementById("body");b.textContent="";b.appendChild(el("p","t",c.greeting));
c.paragraphs.forEach(function(p,i){b.appendChild(el("p",i===c.paragraphs.length-1?"t":"",p))});
document.getElementById("signoff").textContent=c.signoff;document.getElementById("role").textContent=c.role;
var n=document.getElementById("note"),parts=c.note.split("{email}");n.textContent="";n.appendChild(document.createTextNode(parts[0]));var a=el("a","",E);a.href="mailto:"+E;n.appendChild(a);n.appendChild(document.createTextNode(parts[1]||""));
var nav=document.getElementById("langs");nav.textContent="";Object.keys(N).forEach(function(k){var a=el("a","",N[k]);a.href="/"+k+"/";a.lang=k;if(k===l)a.setAttribute("aria-current","true");a.onclick=function(ev){ev.preventDefault();history.replaceState(null,"","/"+k+"/");show(k)};nav.appendChild(a)})}
show(pick());
</script>
</body>
</html>
`;
writeFileSync(out+"index.html", html);
writeFileSync(out+"404.html", html);
console.log("ok", Object.keys(data).length, "langs", html.length, "bytes");
