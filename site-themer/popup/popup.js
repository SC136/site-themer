const { PRESETS, SITES, loadSettings, saveSettings } = SiteThemer;

function el(tag, props = {}, ...children) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...children);
  return e;
}

async function render() {
  const settings = await loadSettings();
  const container = document.getElementById("sites");
  container.replaceChildren();

  for (const id in SITES) {
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
    select.onchange = () => update({ preset: select.value, outgoing: null });

    const color = el("input", { type: "color", value: s.outgoing || preset.outgoing });
    color.onchange = () => update({ outgoing: color.value });
    const reset = el("button", { textContent: "Reset" });
    reset.onclick = () => update({ outgoing: null });

    const swatches = el("div", { className: "swatches" });
    for (const k of ["bg", "surface", "border", "incoming", "outgoing"]) {
      swatches.append(el("span", { style: `background:${k === "outgoing" && s.outgoing ? s.outgoing : preset[k]}` }));
    }

    container.append(
      el("div", { className: "site" },
        el("div", { className: "row" }, el("span", { className: "title", textContent: SITES[id].name }), toggle),
        el("div", { className: "row" }, "Theme", select),
        el("div", { className: "row" }, "Sent bubble", el("span", {}, color, " ", reset)),
        swatches
      )
    );
  }
}

render();
