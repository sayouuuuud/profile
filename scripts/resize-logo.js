const sharp = require('sharp');
const fs = require('fs');

async function maximizeSize() {
  const input = 'd:/profile/app/icon.png';
  
  // 1. Trim all transparent space to get the tightest possible bounds of the logo
  const { data, info } = await sharp(input)
    .trim({ threshold: 0 }) // removes 0-alpha pixels
    .toBuffer({ resolveWithObject: true });
    
  console.log(`Trimmed size: ${info.width}x${info.height}`);

  // 2. To ensure it's a perfect square (so the browser doesn't stretch it),
  // we add back just enough padding to make it a square, plus a tiny 1-2px margin
  // so it doesn't touch the absolute edge.
  const size = Math.max(info.width, info.height);
  const targetSize = size + 2; // small 1px margin on each side

  await sharp(data)
    .extend({
      top: Math.floor((targetSize - info.height) / 2),
      bottom: Math.ceil((targetSize - info.height) / 2),
      left: Math.floor((targetSize - info.width) / 2),
      right: Math.ceil((targetSize - info.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    // Scale it up nicely to a standard favicon size so it renders crisply in all OS
    .resize(512, 512, { kernel: sharp.kernel.mitchell })
    .toFile('d:/profile/app/icon_large.png');
    
  fs.renameSync('d:/profile/app/icon_large.png', input);
  console.log('Trimmed, squared, and upscaled optimally.');
}

maximizeSize();
