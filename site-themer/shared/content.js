(function () {
  const { PRESETS, siteForHost, loadSettings } = SiteThemer;
  const siteId = siteForHost(location.hostname);
  if (!siteId) return;

  const root = document.documentElement;
  const VARS = ["bg", "surface", "border", "input", "incoming", "outgoing"];

  function apply(s) {
    if (!s || !s.enabled) {
      root.removeAttribute("data-st-site");
      VARS.forEach((v) => root.style.removeProperty("--st-" + v));
      return;
    }
    const p = { ...(PRESETS[s.preset] || PRESETS.amoled) };
    if (s.outgoing) p.outgoing = s.outgoing;
    VARS.forEach((v) => root.style.setProperty("--st-" + v, p[v]));
    root.setAttribute("data-st-site", siteId);
  }

  loadSettings().then((all) => apply(all[siteId]));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.settings) loadSettings().then((all) => apply(all[siteId]));
  });
})();
