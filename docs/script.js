// Keep in sync with PRESETS in site-themer/shared/registry.js
const PRESETS = {
  amoled:   { name: "amoled black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
  midnight: { name: "midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
  graphite: { name: "graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" }
};

const tabs = document.getElementById("tabs");
const preview = document.getElementById("preview");

function select(key) {
  const p = PRESETS[key];
  for (const v of ["bg", "surface", "border", "input", "incoming", "outgoing"]) {
    preview.style.setProperty("--p-" + v, p[v]);
  }
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
