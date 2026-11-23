/* Shared by content script and popup.
 *
 * To add a site: add an entry to SITES (hosts + options), a stylesheet in
 * /sites, and a content_scripts block in manifest.json.
 *
 * Option types:
 *   color  - stored as hex or null. With `slot`, overrides that preset color;
 *            without it, sets --st-<key> on <html> (only when not null).
 *   select - `choices` is [[value, label], ...]. Non-empty value sets --st-<key>
 *            to value + (unit || "").
 *   toggle - sets the `attr` attribute on <html> while on.
 */
(function (global) {
  const PRESETS = {
    amoled:   { name: "AMOLED Black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
    midnight: { name: "Midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
    graphite: { name: "Graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" },
    system24: { name: "system24",     bg: "#141414", surface: "#1d1d1d", border: "#515151", input: "#272727", incoming: "#272727", outgoing: "#372645", accent: "#c7a2e3" }
  };

  const SITES = {
    whatsapp: {
      name: "WhatsApp Web",
      hosts: ["web.whatsapp.com"],
      options: [
        { key: "outgoing", type: "color", label: "Sent bubble", slot: "outgoing" },
        { key: "incoming", type: "color", label: "Received bubble", slot: "incoming" },
        { key: "fontSize", type: "select", label: "Message text size", unit: "px", choices: [["", "Default"], ["16", "Large"], ["18", "XL"]] },
        { key: "blur", type: "toggle", label: "Privacy blur (hover to reveal)", attr: "data-st-blur" }
      ]
    },
    youtube: {
      name: "YouTube",
      hosts: ["www.youtube.com"],
      options: [
        { key: "accent", type: "color", label: "Progress bar color", fallback: "#ff0033" },
        { key: "noGlow", type: "toggle", label: "Turn off ambient glow", attr: "data-st-no-glow" },
        { key: "dimThumbs", type: "toggle", label: "Dim thumbnails until hover", attr: "data-st-dim" }
      ]
    }
  };

  const OPTION_DEFAULTS = { color: null, select: "", toggle: false };

  function defaultsFor(id) {
    const d = { enabled: true, preset: "amoled" };
    for (const o of SITES[id].options) d[o.key] = OPTION_DEFAULTS[o.type];
    return d;
  }

  function siteForHost(host) {
    for (const id in SITES) if (SITES[id].hosts.includes(host)) return id;
    return null;
  }

  async function loadSettings() {
    const { settings } = await chrome.storage.sync.get("settings");
    const out = {};
    for (const id in SITES) out[id] = { ...defaultsFor(id), ...((settings || {})[id] || {}) };
    return out;
  }

  async function saveSettings(settings) {
    await chrome.storage.sync.set({ settings });
  }

  global.SiteThemer = { PRESETS, SITES, siteForHost, loadSettings, saveSettings };
})(globalThis);
