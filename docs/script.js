// Keep in sync with PRESETS in site-themer/shared/registry.js
const PRESETS = {
  amoled:   { name: "amoled black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
  midnight: { name: "midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
  graphite: { name: "graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" },
  system24: { name: "system24",     bg: "#141414", surface: "#1d1d1d", border: "#515151", input: "#272727", incoming: "#272727", outgoing: "#372645" }
};

const tabs = document.getElementById("tabs");
const preview = document.getElementById("preview");
const presetDescription = document.getElementById("preset-description");
const descriptions = {
  amoled: "Pure black backgrounds with a subtle green chat accent.",
  midnight: "Deep navy surfaces with cool blue message bubbles.",
  graphite: "Soft charcoal surfaces with muted green message bubbles.",
  system24: "Terminal-style monospace type, square edges, and purple accents."
};

function selectPreset(key) {
  const p = PRESETS[key];
  preview.dataset.preset = key;
  presetDescription.textContent = descriptions[key];
  for (const v of ["bg", "surface", "border", "input", "incoming", "outgoing"]) {
    preview.style.setProperty("--p-" + v, p[v]);
  }
  tabs.querySelectorAll("button").forEach((button, index) => {
    const selected = button.dataset.key === key;
    button.setAttribute("aria-pressed", String(selected));
    if (selected) {
      tabs.style.setProperty("--preset-index", index);
      tabs.style.setProperty("--preset-column", index % 2);
      tabs.style.setProperty("--preset-row", Math.floor(index / 2));
    }
  });
}

for (const key of ["system24", "amoled", "midnight", "graphite"]) {
  const preset = PRESETS[key];
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = preset.name;
  b.dataset.key = key;
  b.style.setProperty("--swatch-bg", preset.bg);
  b.style.setProperty("--swatch-accent", preset.outgoing);
  b.setAttribute("aria-controls", "preview");
  b.onclick = () => {
    if (preview.dataset.preset === key) return;
    selectPreset(key);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      preview.getAnimations().forEach((animation) => {
        if (animation.id === "preset-reveal") animation.cancel();
      });
      preview.animate(
        [{ clipPath: "inset(0 0 18% 0)", opacity: .65 }, { clipPath: "inset(0)", opacity: 1 }],
        { id: "preset-reveal", duration: 300, easing: "cubic-bezier(.22, 1, .36, 1)" }
      );
    }
  };
  tabs.append(b);
}
selectPreset("system24");

const siteButtons = document.querySelectorAll(".preview-sites button");
for (const button of siteButtons) {
  button.onclick = () => {
    for (const option of siteButtons) {
      const selected = option === button;
      option.setAttribute("aria-pressed", String(selected));
      document.getElementById(option.getAttribute("aria-controls")).hidden = !selected;
    }
  };
}

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
