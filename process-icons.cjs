const sharp = require('sharp');
const fs = require('fs');

async function processImages() {
  const baseIcon = 'public/app-icon.png';
  if (fs.existsSync(baseIcon)) {
    console.log(`Processing ${baseIcon}...`);
    // Create 192 variant
    await sharp(baseIcon).resize(192, 192).toFile('public/icon-192-v2.png');
    console.log('Created icon-192-v2.png');
    // Create 512 variant
    await sharp(baseIcon).resize(512, 512).toFile('public/icon-512-v2.png');
    console.log('Created icon-512-v2.png');
  } else {
    console.log('base icon not found');
  }
}

processImages();
