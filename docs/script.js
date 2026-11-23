// Keep in sync with PRESETS in site-themer/shared/registry.js
const PRESETS = {
  amoled:   { name: "AMOLED Black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
  midnight: { name: "Midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
  graphite: { name: "Graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" },
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

// Browser picker and clipboard fallback for internal extensions URLs.
const browsers = { Chrome: "chrome://extensions", Edge: "edge://extensions", Brave: "brave://extensions" };
const picker = document.getElementById("browsers");
const urlEl = document.getElementById("ext-url");
const copyStatus = document.getElementById("copy-status");

function pickBrowser(browser) {
  urlEl.textContent = browsers[browser];
  copyStatus.textContent = "";
  for (const button of picker.children) {
    button.setAttribute("aria-pressed", String(button.textContent === browser));
  }
}
for (const browser of Object.keys(browsers)) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = browser;
  button.onclick = () => pickBrowser(browser);
  picker.append(button);
}
pickBrowser(navigator.userAgent.includes("Edg/") ? "Edge" : navigator.brave ? "Brave" : "Chrome");

document.getElementById("copy-url").onclick = async () => {
  try {
    await navigator.clipboard.writeText(urlEl.textContent);
    copyStatus.textContent = "Copied. Paste the address into a new tab.";
  } catch {
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(urlEl);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = "Address selected. Copy it and paste it into a new tab.";
  }
};

// Show setup after the hero download starts.
for (const link of document.querySelectorAll("a[download]")) {
  link.addEventListener("click", () => {
    document.getElementById("started").hidden = false;
    if (!link.closest("#install")) document.getElementById("install").scrollIntoView();
  });
}

const appearance = document.getElementById("theme");
function setAppearance(dark) {
  document.documentElement.classList.toggle("dark", dark);
  appearance.setAttribute("aria-pressed", String(dark));
}
try { setAppearance(localStorage.getItem("theme") === "dark"); } catch {}
appearance.onclick = () => {
  const dark = appearance.getAttribute("aria-pressed") === "false";
  setAppearance(dark);
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
};
