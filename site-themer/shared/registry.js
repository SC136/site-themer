/* Shared by content script and popup.
 * To add a site: add an entry to SITES, a stylesheet in /sites, and a
 * content_scripts block in manifest.json.
 */
(function (global) {
  const PRESETS = {
    amoled:   { name: "AMOLED Black", bg: "#000000", surface: "#080808", border: "#141414", input: "#0b0b0b", incoming: "#0f0f0f", outgoing: "#0b3d2e" },
    midnight: { name: "Midnight",     bg: "#05070d", surface: "#0c111c", border: "#1a2233", input: "#0f1522", incoming: "#121a2a", outgoing: "#1f3b6e" },
    graphite: { name: "Graphite",     bg: "#0e0e10", surface: "#17171a", border: "#26262b", input: "#1c1c20", incoming: "#222226", outgoing: "#2f4f4a" }
  };

  const SITES = {
    whatsapp: { name: "WhatsApp Web", hosts: ["web.whatsapp.com"] }
  };

  const DEFAULT_SITE_SETTINGS = { enabled: true, preset: "amoled", outgoing: null, incoming: null, blur: false, fontSize: "" };

  function siteForHost(host) {
    for (const id in SITES) if (SITES[id].hosts.includes(host)) return id;
    return null;
  }

  async function loadSettings() {
    const { settings } = await chrome.storage.sync.get("settings");
    const out = {};
    for (const id in SITES) out[id] = { ...DEFAULT_SITE_SETTINGS, ...((settings || {})[id] || {}) };
    return out;
  }

  async function saveSettings(settings) {
    await chrome.storage.sync.set({ settings });
  }

  global.SiteThemer = { PRESETS, SITES, siteForHost, loadSettings, saveSettings };
})(globalThis);
