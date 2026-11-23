// Generates the logo PNGs (no dependencies). Run: node scripts/make-icons.js
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const BG = [30, 18, 45];
const MARK = [
  { color: [171, 127, 247], points: [[18, 58], [46, 74], [74, 58], [74, 68], [46, 84], [18, 68]] },
  { color: [238, 191, 248], points: [[18, 46], [46, 30], [74, 46], [46, 62]] },
  { color: [255, 241, 204], points: [[77, 14], [80, 22], [88, 25], [80, 28], [77, 36], [74, 28], [66, 25], [74, 22]] },
];

function crc32(buf) {
  let c, crc = ~0;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function png(size, pixel) {
  const SS = 4;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const p = pixel((x + (sx + .5) / SS) / size, (y + (sy + .5) / SS) / size);
        if (p) { r += p[0]; g += p[1]; b += p[2]; a++; }
      }
      const o = y * (size * 4 + 1) + 1 + x * 4;
      const n = SS * SS;
      raw[o] = a ? r / a : 0; raw[o + 1] = a ? g / a : 0; raw[o + 2] = a ? b / a : 0;
      raw[o + 3] = Math.round((a / n) * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
  ]);
}

const inRoundRect = (x, y, r) => {
  const cx = Math.min(Math.max(x, r), 1 - r), cy = Math.min(Math.max(y, r), 1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
function inPolygon(x, y, points) {
  let inside = false;
  for (let index = 0; index < points.length; index++) {
    const [ax, ay] = points[index];
    const [bx, by] = points[(index + 1) % points.length];
    if ((ay > y) !== (by > y) && x < ax + (bx - ax) * (y - ay) / (by - ay)) inside = !inside;
  }
  return inside;
}

// A pair of theme layers and a star on a dark rounded tile.
const logo = (x, y) => {
  if (!inRoundRect(x, y, 0.22)) return null;
  return MARK.find(({ points }) => inPolygon(x * 100, y * 100, points))?.color || BG;
};

const root = path.join(__dirname, "..");
const targets = [
  ["site-themer/icons/icon-16.png", 16],
  ["site-themer/icons/icon-32.png", 32],
  ["site-themer/icons/icon-48.png", 48],
  ["site-themer/icons/icon-128.png", 128],
  ["docs/favicon-32.png", 32],
  ["docs/apple-touch-icon.png", 180],
  ["docs/logo-512.png", 512],
];
for (const [file, size] of targets) {
  fs.writeFileSync(path.join(root, file), png(size, logo));
  console.log("wrote", file);
}

const toHex = (rgb) => "#" + Buffer.from(rgb).toString("hex");
const markSvg = MARK.map(({ color, points }) =>
  `  <polygon points="${points.map((point) => point.join(",")).join(" ")}" fill="${toHex(color)}"/>`
).join("\n");
fs.writeFileSync(path.join(root, "docs/favicon.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="${toHex(BG)}"/>
${markSvg}
</svg>
`);
console.log("wrote docs/favicon.svg");
