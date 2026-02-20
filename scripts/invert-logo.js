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
        // Background (previously transparent/dark) -> Target Green
        // SE Letters (previously target green) -> Black
        // The frame (previously darker green) -> Target Green
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
                // Keep original alpha for smooth edges
            } else {
                // Background and frame -> Target Green
                data[i] = targetR;
                data[i + 1] = targetG;
                data[i + 2] = targetB;
                // We ensure it gets full opacity if it was previously an opaque black background
                // but preserve partial alpha for antialiasing on the outer edges
                if (a > 10) {
                    data[i + 3] = a > 200 ? 255 : a;
                }
            }
        }

        // Now let's run the sizing logic directly here so it's all in one pass
        const rawBuffer = await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
            .trim({ threshold: 0 })
            .toBuffer({ resolveWithObject: true });

        const size = Math.max(rawBuffer.info.width, rawBuffer.info.height);
        const targetSize = size;

        await sharp(rawBuffer.data, {
            raw: {
                width: rawBuffer.info.width,
                height: rawBuffer.info.height,
                channels: rawBuffer.info.channels
            }
        })
            .extend({
                top: Math.floor((targetSize - rawBuffer.info.height) / 2),
                bottom: Math.ceil((targetSize - rawBuffer.info.height) / 2),
                left: Math.floor((targetSize - rawBuffer.info.width) / 2),
                right: Math.ceil((targetSize - rawBuffer.info.width) / 2),
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .resize(512, 512, { kernel: sharp.kernel.mitchell })
            .png()
            .toFile(outputImagePath);

        console.log('Successfully created inverted icon.png');

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
