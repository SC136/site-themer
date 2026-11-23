const { PRESETS, SITES, siteForHost, loadSettings, saveSettings } = SiteThemer;

function el(tag, props = {}, ...children) {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
}

const siteList = document.getElementById("sites");
const themeList = document.getElementById("presets");
const options = document.getElementById("options");
const customize = document.getElementById("customize");
const enabled = document.getElementById("enabled");
const enabledLabel = document.getElementById("enabled-label");
const status = document.getElementById("status");

let settings;
let siteId;
let pendingSave = Promise.resolve();

function showError(message) {
  status.textContent = message;
  status.hidden = !message;
}

function update(patch) {
  settings = { ...settings, [siteId]: { ...settings[siteId], ...patch } };
  refresh();
  const snapshot = settings;
  pendingSave = pendingSave.then(async () => {
    try {
      await saveSettings(snapshot);
      showError("");
    } catch {
      showError("Could not save settings. Try changing the setting again.");
    }
  });
}

function optionRow(option) {
  const { key, label, type } = option;
  const name = "option-" + key;
  const caption = el("label", { htmlFor: name, textContent: label });
  if (type === "toggle") {
    const input = el("input", { id: name, type: "checkbox" });
    input.onchange = () => update({ [key]: input.checked });
    return el("div", { className: "row" }, caption, input);
  }
  if (type === "select") {
    const select = el("select", { id: name });
    for (const [value, textContent] of option.choices) select.append(el("option", { value, textContent }));
    select.onchange = () => update({ [key]: select.value });
    return el("div", { className: "row" }, caption, select);
  }

  const color = el("input", { id: name, type: "color" });
  color.onchange = () => update({ [key]: color.value });
  const reset = el("button", { type: "button", className: "reset", textContent: "Reset" });
  reset.setAttribute("aria-label", "Reset " + label.toLowerCase());
  reset.onclick = () => update({ [key]: null });
  return el("div", { className: "row" }, caption, el("span", { className: "color-controls" }, color, reset));
}

function setPreset(key) {
  const patch = { preset: key };
  for (const option of SITES[siteId].options) {
    if (option.type === "color" && option.slot) patch[option.key] = null;
  }
  update(patch);
}

for (const [key, preset] of Object.entries(PRESETS)) {
  const input = el("input", { type: "radio", name: "preset", value: key });
  input.onchange = () => setPreset(key);
  const palette = el("span", { className: "palette" }, el("span"), el("span"), el("span"));
  palette.setAttribute("aria-hidden", "true");
  const mark = el("span", { className: "selected-mark" });
  mark.setAttribute("aria-hidden", "true");
  themeList.append(el("label", { className: "preset" }, input, palette,
    el("span", { className: "preset-name" }, preset.name, mark)));
}

for (const [key, site] of Object.entries(SITES)) {
  const button = el("button", { type: "button", textContent: site.name });
  button.dataset.site = key;
  button.setAttribute("aria-controls", "settings");
  button.onclick = () => selectSite(key);
  siteList.append(button);
}

function refresh() {
  const site = SITES[siteId];
  const saved = settings[siteId];
  const selected = Object.hasOwn(PRESETS, saved.preset) ? saved.preset : "amoled";
  const preset = PRESETS[selected];
  const colorOption = site.options.find((option) => option.type === "color" && !option.slot)
    || site.options.find((option) => option.slot === "outgoing");
  enabled.checked = saved.enabled;
  enabledLabel.textContent = saved.enabled ? "On" : "Off";

  for (const card of themeList.children) {
    const input = card.querySelector("input");
    input.checked = input.value === selected;
    const colors = PRESETS[input.value];
    const currentColor = input.checked && colorOption && saved[colorOption.key];
    const accent = currentColor || colors[colorOption?.slot || colorOption?.key] || colorOption?.fallback || colors.outgoing;
    const tiles = card.querySelector(".palette").children;
    tiles[0].style.backgroundColor = colors.bg;
    tiles[1].style.backgroundColor = colors.surface;
    tiles[2].style.backgroundColor = accent;
  }

  for (const option of site.options) {
    const control = document.getElementById("option-" + option.key);
    if (option.type === "toggle") control.checked = saved[option.key];
    else if (option.type === "select") control.value = saved[option.key];
    else control.value = saved[option.key] || preset[option.slot || option.key] || option.fallback;
  }
}

function selectSite(id) {
  if (id === siteId) return;
  siteId = id;
  for (const button of siteList.children) {
    button.setAttribute("aria-pressed", String(button.dataset.site === id));
  }
  options.replaceChildren(...SITES[id].options.map(optionRow));
  customize.open = false;
  refresh();
}

async function activeSite() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.url ? siteForHost(new URL(tab.url).hostname) : null;
  } catch {
    return null;
  }
}

async function initialize() {
  try {
    const [saved, active] = await Promise.all([loadSettings(), activeSite()]);
    settings = saved;
    selectSite(active || Object.keys(SITES)[0]);
    enabled.onchange = () => update({ enabled: enabled.checked });
    siteList.hidden = false;
    document.getElementById("settings").hidden = false;
  } catch {
    showError("Could not load settings. Reopen the popup to try again.");
  }
}

initialize();
