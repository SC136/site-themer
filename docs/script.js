// Keep in sync with PRESETS in site-themer/shared/registry.js
const PRESETS = {
  amoled:   { name: "AMOLED Black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
  midnight: { name: "Midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
  graphite: { name: "Graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" }
};

const tabs = document.getElementById("tabs");
const preview = document.getElementById("preview");

function select(key) {
  const p = PRESETS[key];
  for (const v of ["bg", "surface", "border", "input", "incoming", "outgoing"]) {
    preview.style.setProperty("--" + v, p[v]);
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
