import fs from 'fs';
import sharp from 'sharp';

const svgDesktop = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#020617"/>
  <text x="640" y="360" font-family="Arial" font-size="60" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">IT Health v2.0 - Desktop</text>
</svg>`;

const svgMobile = `<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="1280" fill="#020617"/>
  <text x="360" y="640" font-family="Arial" font-size="60" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">IT Health v2.0</text>
  <text x="360" y="720" font-family="Arial" font-size="40" fill="#cbd5e1" text-anchor="middle" dominant-baseline="middle">Mobile View</text>
</svg>`;

const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#020617"/>
  <text x="256" y="256" font-family="Arial" font-size="100" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">IT Health</text>
</svg>`;

async function generate() {
  await sharp(Buffer.from(svgDesktop))
    .png()
    .toFile('public/screenshot-desktop.png');
    
  await sharp(Buffer.from(svgMobile))
    .png()
    .toFile('public/screenshot-mobile.png');

  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
    
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');
    
  console.log("Images generated");
}

generate();
