const sharp = require('sharp');
const fs = require('fs');

const inputImagePath = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\76c623d8-4d4a-422d-b920-83b9f1a74e36\\media__1771545315382.png';
const outputImagePath = 'd:\\profile\\app\\icon.png';

async function processImage() {
    try {
        const { data, info } = await sharp(inputImagePath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        let maxGreen = 0;
        let targetR = 0, targetG = 0, targetB = 0;

        for (let i = 0; i < data.length; i += info.channels) {
            if (data[i + 1] > maxGreen) {
                maxGreen = data[i + 1];
                targetR = data[i];
                targetG = data[i + 1];
                targetB = data[i + 2];
            }
        }

        for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 10) continue;

            if (g > 100 && r < 100) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            } else {
                data[i] = targetR;
                data[i + 1] = targetG;
                data[i + 2] = targetB;
                if (a > 10) {
                    data[i + 3] = a > 200 ? 255 : a;
                }
            }
        }

        // Step 1: Render intermediate PNG buffer directly from our modified raw pixel array
        const intermediatePng = await sharp(data, {
            raw: { width: info.width, height: info.height, channels: info.channels }
        }).png().toBuffer();

        // Step 2: Create precise SVG mask matching exactly this resolution
        // Using a softer corner radius ~18% looks closer to iOS/modern squarcles
        const rx = Math.round(info.width * 0.18);
        const svgMaskString = `
      <svg width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${info.width}" height="${info.height}" rx="${rx}" fill="#fff"/>
      </svg>`;

        const maskBuffer = Buffer.from(svgMaskString);

        // Step 3: Composite mask using dest-in
        await sharp(intermediatePng)
            .composite([{
                input: maskBuffer,
                blend: 'dest-in'
            }])
            .toFile(outputImagePath);

        console.log(`Successfully created rounded icon.png with rx=${rx}`);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
