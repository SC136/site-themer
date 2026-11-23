# Repository Guidelines

## Project Structure

- `site-themer/` is the Manifest V3 extension for WhatsApp Web and YouTube. `shared/registry.js` defines sites, presets, options, and storage. `shared/content.js` applies settings. `popup/` builds the settings UI from the registry, `sites/` contains per-site CSS, and `icons/` contains extension icons.
- `docs/` hosts the static GitHub Pages landing page, preview assets, and downloadable ZIP. `scripts/make-icons.js` generates the extension icons and landing-page logos and favicons.

## Development and Packaging

- Open `chrome://extensions`, enable Developer mode, and load `site-themer/` unpacked. Reload the extension and refresh the target page after editing.
- Run `python -m http.server 8000 --directory docs` from the repository root and open `http://localhost:8000` to preview the landing page and its JavaScript modules.
- Run `powershell -File package-extension.ps1` from the repository root after extension changes. Commit the rebuilt `docs/downloads/site-themer.zip` with the source changes.
- Run `node scripts/make-icons.js` from the repository root when updating icon artwork.

## Coding Style

Use plain JavaScript, HTML, and CSS. Match local indentation, typically two spaces in JavaScript and HTML and four spaces in `sites/*.css`. Use camelCase for JavaScript names and lowercase site IDs. No linter or formatter is configured.

For a new site, add its registry entry, `sites/<id>.css`, and a matching `content_scripts` entry in `manifest.json`. Scope CSS with `html[data-st-site="<id>"]` and use `--st-*` theme variables. Keep the preview presets in `docs/script.js` in sync with the registry.

Before editing UI SDK controls, follow the UI SDK skill if installed and consult the [Web Components docs](https://ui-sdk.dev/docs/web-components). For package-level details, see `node_modules/@ui-sdk/web/docs/llms.txt` in a checkout with the dependency installed. The static site ships the pinned bundle documented in `docs/vendor/README.md`.

## Testing

The repository uses manual browser checks and has no automated test suite or coverage threshold. Enable the site’s native dark theme, then check preset switching, the per-site toggle, and affected options. Refresh to confirm settings persist. For shared changes, repeat on both supported sites. For landing-page changes, check the interactive preview and download link.

## Commits and Pull Requests

Use short, imperative commit subjects, such as `Add YouTube support and data-driven site options`. In pull requests, summarize the change, list the manual checks performed, link related issues when applicable, and include screenshots for visible changes.

## Windows Agent Commands

When using the Codex tools bridge on Windows, invoke supported commands through RTK explicitly, for example `rtk git status`.
