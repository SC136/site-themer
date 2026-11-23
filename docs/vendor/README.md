# UI SDK bundle

`ui-sdk-segmented.js` bundles Vercel Labs UI SDK’s Web Components segmented control. GitHub Pages serves the bundle directly alongside the other static assets.

To rebuild it in a temporary directory, install `@ui-sdk/web@0.1.0-beta.16`, `@ui-sdk/core@0.1.0-beta.16`, and `esbuild@0.27.2`. Create an `entry.mjs` containing `import "@ui-sdk/web/segmented-control";`, then run:

```sh
npx esbuild entry.mjs --bundle --minify --format=esm --legal-comments=linked --outfile=ui-sdk-segmented.js
```

Copy the bundle here with any generated legal notices. Both UI SDK packages ship the same Apache 2.0 license, included as `ui-sdk-LICENSE.txt`.
