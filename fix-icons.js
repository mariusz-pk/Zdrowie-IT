import sharp from 'sharp';

async function run() {
  try {
    await sharp('public/Icon_App_Health_IT.png')
      .resize(192, 192)
      .png()
      .toFile('public/icon-192.png');
    await sharp('public/Icon_App_Health_IT.png')
      .resize(512, 512)
      .png()
      .toFile('public/icon-512.png');
    console.log("Icons successfully created from the new image.");
  } catch (err) {
    console.error("Error creating icons:", err);
  }
}
run();
