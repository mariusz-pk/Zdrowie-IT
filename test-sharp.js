import sharp from 'sharp';
async function test() {
  const b = await sharp({
    create: { width: 10, height: 10, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } }
  }).png().toBuffer();
  console.log(b.slice(0, 4));
}
test();
