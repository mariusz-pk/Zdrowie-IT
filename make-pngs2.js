import sharp from 'sharp';

async function run() {
  await sharp('src/assets/images/app_health_icon_1783847909327.jpg')
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
  await sharp('src/assets/images/app_health_icon_1783847909327.jpg')
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');
  console.log("PNGs created from jpg.");
}
run();
