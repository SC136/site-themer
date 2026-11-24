# Site Themer

Custom themes for websites. Currently supports **WhatsApp Web** and **YouTube**.

- Four presets for every site: AMOLED Black, Midnight, Graphite, and system24
- system24 adapts [refact0r's Discord theme](https://github.com/refact0r/system24) for WhatsApp Web and YouTube with square corners, framed panels and controls, monospace type, and purple accents
- Per-site on/off
- WhatsApp options: sent/received bubble colors, message text size, privacy blur (hover to reveal)
- YouTube options: progress bar color, turn off ambient glow, dim thumbnails until hover

## Install for Edge

Open [Site Themer on Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/site-themer/mjhmgldpnfndcilfkoomijbobnkmhpfo) and click **Get**.

## Install manually (Chrome, Edge, Brave)

1. Open `chrome://extensions` and enable **Developer mode**.
2. **Load unpacked** and select this folder.
3. Turn on each site's own dark theme (WhatsApp: Settings > Chat > Theme > Dark. YouTube: profile picture > Appearance > Dark theme).
4. Click the extension icon to pick a theme.

## Share

Zip this folder and send it.

## Layout

- `shared/registry.js` – site list, per-site options, presets, settings storage
- `shared/content.js` – applies the chosen preset and options as CSS variables / attributes on the page
- `sites/<site>.css` – per-site styles, gated by `html[data-st-site="<site>"]`
- `popup/` – settings UI, generated from the registry

## Adding a site

1. Add an entry to `SITES` in `shared/registry.js` with its `hosts` and `options` (types: `color`, `select`, `toggle`; see the comment at the top of the file).
2. Create `sites/<id>.css` using the `--st-bg`, `--st-surface`, `--st-border`, `--st-input`, `--st-incoming`, `--st-outgoing` variables and any option variables or attributes.
3. Add a `content_scripts` block to `manifest.json` with the site's `matches`, the CSS, and `shared/registry.js` + `shared/content.js`.
