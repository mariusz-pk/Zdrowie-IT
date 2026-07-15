import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  // Use existing Icon_App_Health_IT.png for icons
  if (fs.existsSync('public/Icon_App_Health_IT.png')) {
    await sharp('public/Icon_App_Health_IT.png')
      .resize(192, 192)
      .png()
      .toFile('public/icon-192.png');
      
    await sharp('public/Icon_App_Health_IT.png')
      .resize(512, 512)
      .png()
      .toFile('public/icon-512.png');
  }

  // Use existing image for desktop screenshot, maybe resize/pad
  if (fs.existsSync('public/WszystkokolwiekWFormie__Ciemne_Social.png')) {
    await sharp('public/WszystkokolwiekWFormie__Ciemne_Social.png')
      .resize(1280, 720, { fit: 'contain', background: { r: 2, g: 6, b: 23, alpha: 1 } })
      .png()
      .toFile('public/screenshot-desktop.png');
      
    await sharp('public/WszystkokolwiekWFormie__Ciemne_Social.png')
      .resize(720, 1280, { fit: 'contain', background: { r: 2, g: 6, b: 23, alpha: 1 } })
      .png()
      .toFile('public/screenshot-mobile.png');
  }
  console.log("Images generated from existing assets");
}
generate();
