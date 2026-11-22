(function () {
  const { PRESETS, SITES, siteForHost, loadSettings } = SiteThemer;
  const siteId = siteForHost(location.hostname);
  if (!siteId) return;

  const site = SITES[siteId];
  const root = document.documentElement;
  const VARS = ["bg", "surface", "border", "input", "incoming", "outgoing"];

  function clear() {
    root.removeAttribute("data-st-site");
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
    for (const k in extra) root.style.setProperty("--st-" + k, extra[k]);
    root.setAttribute("data-st-site", siteId);
  }

  loadSettings().then((all) => apply(all[siteId]));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.settings) loadSettings().then((all) => apply(all[siteId]));
  });
})();
