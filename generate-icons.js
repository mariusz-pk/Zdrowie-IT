import fs from 'fs';
import sharp from 'sharp';

const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#020617"/>
  <text x="256" y="256" font-family="Arial" font-size="100" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">IT Health</text>
</svg>`;

async function generate() {
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
    
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');
    
  console.log("Icons generated");
}

generate();
