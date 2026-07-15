import sharp from 'sharp';
import fs from 'fs';

const svgIcon192 = `
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#020617"/>
  <text x="96" y="96" font-family="sans-serif" font-size="64" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ITH</text>
</svg>
`;

const svgIcon512 = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#020617"/>
  <text x="256" y="256" font-family="sans-serif" font-size="128" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ITH</text>
</svg>
`;

const desktopSvg = `
<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#020617"/>
  <text x="640" y="360" font-family="sans-serif" font-size="64" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">IT Health Desktop</text>
</svg>
`;

const mobileSvg = `
<svg width="720" height="1280" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="1280" fill="#020617"/>
  <text x="360" y="640" font-family="sans-serif" font-size="64" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">IT Health Mobile</text>
</svg>
`;

async function run() {
  await sharp(Buffer.from(svgIcon192)).png().toFile('public/icon-192.png');
  await sharp(Buffer.from(svgIcon512)).png().toFile('public/icon-512.png');
  await sharp(Buffer.from(desktopSvg)).png().toFile('public/screenshot-desktop.png');
  await sharp(Buffer.from(mobileSvg)).png().toFile('public/screenshot-mobile.png');
  console.log("PNGs created.");
}
run();
