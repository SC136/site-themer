const { PRESETS, SITES, loadSettings, saveSettings } = SiteThemer;

function el(tag, props = {}, ...children) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...children);
  return e;
}

function optionRow(o, s, preset, update) {
  if (o.type === "toggle") {
    const box = el("input", { type: "checkbox", checked: !!s[o.key] });
    box.onchange = () => update({ [o.key]: box.checked });
    return el("div", { className: "row" }, o.label, box);
  }

  if (o.type === "select") {
    const sel = el("select");
    for (const [v, label] of o.choices) sel.append(el("option", { value: v, textContent: label, selected: v === s[o.key] }));
    sel.onchange = () => update({ [o.key]: sel.value });
    return el("div", { className: "row" }, o.label, sel);
  }

  const current = s[o.key] || (o.slot ? preset[o.slot] : o.fallback);
  const color = el("input", { type: "color", value: current });
  color.onchange = () => update({ [o.key]: color.value });
  const reset = el("button", { textContent: "Reset" });
  reset.onclick = () => update({ [o.key]: null });
  return el("div", { className: "row" }, o.label, el("span", {}, color, " ", reset));
}

async function render() {
  const settings = await loadSettings();
  const container = document.getElementById("sites");
  container.replaceChildren();

  for (const id in SITES) {
    const site = SITES[id];
    const s = settings[id];
    const update = async (patch) => {
      Object.assign(s, patch);
      await saveSettings(settings);
      render();
    };
    const preset = PRESETS[s.preset] || PRESETS.amoled;

    const toggle = el("input", { type: "checkbox", checked: s.enabled });
    toggle.onchange = () => update({ enabled: toggle.checked });

    const select = el("select");
    for (const key in PRESETS) select.append(el("option", { value: key, textContent: PRESETS[key].name, selected: key === s.preset }));
    select.onchange = () => {
      const reset = { preset: select.value };
      for (const o of site.options) if (o.type === "color" && o.slot) reset[o.key] = null;
      update(reset);
    };

    const swatches = el("div", { className: "swatches" });
    for (const k of ["bg", "surface", "border", "incoming", "outgoing"]) {
      const custom = site.options.find((o) => o.slot === k && s[o.key]);
      swatches.append(el("span", { style: `background:${custom ? s[custom.key] : preset[k]}` }));
    }

    container.append(
      el("div", { className: "site" },
        el("div", { className: "row" }, el("span", { className: "title", textContent: site.name }), toggle),
        el("div", { className: "row" }, "Theme", select),
        ...site.options.map((o) => optionRow(o, s, preset, update)),
        swatches
      )
    );
  }
}

render();
