(function () {
  const { PRESETS, siteForHost, loadSettings } = SiteThemer;
  const siteId = siteForHost(location.hostname);
  if (!siteId) return;

  const root = document.documentElement;
  const VARS = ["bg", "surface", "border", "input", "incoming", "outgoing"];

  function apply(s) {
    if (!s || !s.enabled) {
      root.removeAttribute("data-st-site");
      root.removeAttribute("data-st-blur");
      root.style.removeProperty("--st-font");
      VARS.forEach((v) => root.style.removeProperty("--st-" + v));
      return;
    }
    const p = { ...(PRESETS[s.preset] || PRESETS.amoled) };
    if (s.outgoing) p.outgoing = s.outgoing;
    if (s.incoming) p.incoming = s.incoming;
    if (s.blur) root.setAttribute("data-st-blur", "1");
    else root.removeAttribute("data-st-blur");
    if (s.fontSize) root.style.setProperty("--st-font", s.fontSize + "px");
    else root.style.removeProperty("--st-font");
    VARS.forEach((v) => root.style.setProperty("--st-" + v, p[v]));
    root.setAttribute("data-st-site", siteId);
  }

  loadSettings().then((all) => apply(all[siteId]));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.settings) loadSettings().then((all) => apply(all[siteId]));
  });
})();
