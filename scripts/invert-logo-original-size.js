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

        // Step 1: Find the target SE green color
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

        console.log(`Target letter color found: R=${targetR}, G=${targetG}, B=${targetB}`);

        // Step 2: Invert
        // We apply the exact same inversion but DO NOT trim or resize. We keep the original size and layout.
        for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // If it's fully transparent (e.g. outside rounded corners), keep it transparent
            if (a < 10) {
                continue;
            }

            // If it's a bright letter (since original letters are bright green SE)
            if (g > 100 && r < 100) {
                // 'SE' letter -> Black
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            } else {
                // Background and frame -> Target Green
                data[i] = targetR;
                data[i + 1] = targetG;
                data[i + 2] = targetB;
                if (a > 10) {
                    data[i + 3] = a > 200 ? 255 : a;
                }
            }
        }

        // Save directly without any trim or resizing
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
            .png()
            .toFile(outputImagePath);

        console.log('Successfully created inverted icon.png with original letter size');

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
