# Site Themer

Custom themes for websites. Currently supports **WhatsApp Web** with three presets
(AMOLED Black, Midnight, Graphite), custom sent/received bubble colors, message text size, a privacy blur (hover to reveal), and per-site on/off.

## Install (Chrome, Edge, Brave)

1. Open `chrome://extensions` and enable **Developer mode**.
2. **Load unpacked** and select this folder.
3. Open https://web.whatsapp.com, turn on WhatsApp's dark theme (Settings > Chat > Theme > Dark).
4. Click the extension icon to pick a theme.

## Share

Zip this folder and send it.

## Layout

- `shared/registry.js` – site list, presets, settings storage
- `shared/content.js` – applies the chosen preset as CSS variables on the page
- `sites/<site>.css` – per-site styles, gated by `html[data-st-site="<site>"]`
- `popup/` – settings UI

## Adding a site

1. Add an entry to `SITES` in `shared/registry.js`.
2. Create `sites/<id>.css` using the `--st-bg`, `--st-surface`, `--st-border`, `--st-input`, `--st-incoming`, `--st-outgoing` variables.
3. Add a `content_scripts` block to `manifest.json` with the site's `matches`, the CSS, and `shared/registry.js` + `shared/content.js`.
