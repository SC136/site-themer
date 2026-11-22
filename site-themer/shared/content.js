(function () {
  const { PRESETS, SITES, siteForHost, loadSettings } = SiteThemer;
  const siteId = siteForHost(location.hostname);
  if (!siteId) return;

  const site = SITES[siteId];
  const root = document.documentElement;
  const VARS = ["bg", "surface", "border", "input", "incoming", "outgoing"];

  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ");
  }

  function clear() {
    root.style.removeProperty("--st-incoming-rgb");
    root.style.removeProperty("--st-outgoing-rgb");
    root.removeAttribute("data-st-site");
    root.removeAttribute("data-st-glass");
    VARS.forEach((v) => root.style.removeProperty("--st-" + v));
    for (const o of site.options) {
      if (o.attr) root.removeAttribute(o.attr);
      if (o.type !== "toggle") root.style.removeProperty("--st-" + o.key);
    }
  }

  function apply(s) {
    clear();
    if (!s || !s.enabled) return;

    const p = { ...(PRESETS[s.preset] || PRESETS.amoled) };
    const extra = {};

    for (const o of site.options) {
      const v = s[o.key];
      if (o.type === "color" && v) {
        if (o.slot) p[o.slot] = v;
        else extra[o.key] = v;
      } else if (o.type === "select" && v) {
        extra[o.key] = v + (o.unit || "");
      } else if (o.type === "toggle" && v) {
        root.setAttribute(o.attr, "1");
      }
    }

    VARS.forEach((v) => root.style.setProperty("--st-" + v, p[v]));
    root.style.setProperty("--st-incoming-rgb", rgb(p.incoming));
    root.style.setProperty("--st-outgoing-rgb", rgb(p.outgoing));
    for (const k in extra) root.style.setProperty("--st-" + k, extra[k]);
    if (p.glass) root.setAttribute("data-st-glass", "1");
    root.setAttribute("data-st-site", siteId);
  }

  loadSettings().then((all) => apply(all[siteId]));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.settings) loadSettings().then((all) => apply(all[siteId]));
  });
})();
