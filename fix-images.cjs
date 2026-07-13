const sharp = require('sharp');
async function fixImages() {
  const baseIcon = 'public/Icon_App_Health_IT.png';
  const screenshotSource = 'public/Ciemne-Social.jpg';
  await sharp(baseIcon).resize(192, 192).toFile('public/icon-192.png');
  await sharp(baseIcon).resize(512, 512).toFile('public/icon-512.png');
  await sharp(screenshotSource).resize(1280, 720, { fit: 'cover' }).toFile('public/screenshot-desktop.png');
  await sharp(screenshotSource).resize(720, 1280, { fit: 'cover' }).toFile('public/screenshot-mobile.png');
  console.log('Fixed images');
}
fixImages().catch(console.error);
