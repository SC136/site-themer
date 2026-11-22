// Generates the logo PNGs (no dependencies). Run: node scripts/make-icons.js
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const BG = [9, 9, 11];
const FG = [56, 189, 248];

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
const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;

// dark rounded square with a sky-blue crescent
const logo = (x, y) => {
  if (!inRoundRect(x, y, 0.22)) return null;
  const moon = inCircle(x, y, 0.5, 0.5, 0.29) && !inCircle(x, y, 0.62, 0.4, 0.25);
  return moon ? FG : BG;
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

fs.writeFileSync(path.join(root, "docs/favicon.svg"),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#09090b"/>
  <mask id="m"><rect width="100" height="100" fill="#fff"/><circle cx="62" cy="40" r="25" fill="#000"/></mask>
  <circle cx="50" cy="50" r="29" fill="#38bdf8" mask="url(#m)"/>
</svg>
`);
console.log("wrote docs/favicon.svg");
