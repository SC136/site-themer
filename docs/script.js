// Keep in sync with PRESETS in site-themer/shared/registry.js
const PRESETS = {
  amoled:   { name: "amoled black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
  midnight: { name: "midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
  graphite: { name: "graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" },
  apple:    { name: "apple",        bg: "#000000", surface: "#1c1c1e", border: "#38383a", input: "#1c1c1e", incoming: "#26252a", outgoing: "#0a84ff" },
  glass:    { name: "liquid glass", glass: true, bg: "#070912", surface: "#1c2236", border: "#3a4052", input: "#1c2236", incoming: "#2a3042", outgoing: "#0a84ff" }
};

const tabs = document.getElementById("tabs");
const preview = document.getElementById("preview");

function select(key) {
  const p = PRESETS[key];
  for (const v of ["bg", "surface", "border", "input", "incoming", "outgoing"]) {
    preview.style.setProperty("--p-" + v, p[v]);
  }
  preview.classList.toggle("glass", !!p.glass);
  tabs.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
}

for (const key in PRESETS) {
  const b = document.createElement("button");
  b.textContent = PRESETS[key].name;
  b.dataset.key = key;
  b.onclick = () => select(key);
  tabs.append(b);
}
select("amoled");

// browser picker + copy button for the extensions page address
const BROWSERS = { chrome: "chrome://extensions", edge: "edge://extensions", brave: "brave://extensions" };
const urlEl = document.getElementById("ext-url");
const picker = document.getElementById("browsers");
const copyBtn = document.getElementById("copy-url");

function pickBrowser(key) {
  urlEl.textContent = BROWSERS[key];
  picker.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
}
for (const key in BROWSERS) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = key;
  b.dataset.key = key;
  b.onclick = () => pickBrowser(key);
  picker.append(b);
}
const ua = navigator.userAgent;
pickBrowser(ua.includes("Edg/") ? "edge" : navigator.brave ? "brave" : "chrome");

// show cmd instead of ctrl on mac
if (/Mac|iPhone|iPad/.test(navigator.platform)) {
  document.querySelectorAll(".k-new").forEach((k) => (k.textContent = "cmd"));
}
const keys = document.getElementById("keys");

copyBtn.onclick = async () => {
  keys.classList.add("on");
  try {
    await navigator.clipboard.writeText(urlEl.textContent);
    copyBtn.textContent = "copied!";
  } catch {
    const r = document.createRange();
    r.selectNodeContents(urlEl);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
    copyBtn.textContent = "press ctrl+c";
  }
  setTimeout(() => (copyBtn.textContent = "copy"), 1800);
};

// after a download starts, guide the user to the install steps
document.querySelectorAll("a[download]").forEach((a) => {
  a.addEventListener("click", () => {
    const install = document.getElementById("install");
    const note = document.getElementById("started");
    if (note) note.hidden = false;
    setTimeout(() => {
      install.scrollIntoView({ behavior: "smooth", block: "start" });
      install.classList.remove("flash");
      void install.offsetWidth;
      install.classList.add("flash");
    }, 400);
  });
});

// light / dark toggle with circular reveal from the button
const toggle = document.getElementById("theme");
toggle.onclick = () => {
  const r = toggle.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty("--rx", ((r.left + r.width / 2) / innerWidth) * 100 + "%");
  root.style.setProperty("--ry", ((r.top + r.height / 2) / innerHeight) * 100 + "%");
  const flip = () => {
    const light = root.classList.toggle("light");
    localStorage.setItem("theme", light ? "light" : "dark");
  };
  if (document.startViewTransition) document.startViewTransition(flip);
  else flip();
};
