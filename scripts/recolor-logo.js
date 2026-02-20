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

        // Step 1: Find the color of the SE letters. It should be the brightest green.
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

        // Step 2: Recolor the frame. The frame is also green but darker.
        // Anything that is not pure black background and not the text itself should be recolored.
        for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If it's near black (background), make it transparent
            if (r < 25 && g < 25 && b < 25) {
                data[i + 3] = 0; // Transparent
                continue;
            }

            // Calculate luminance or brightness 
            const brightness = (r + g + b) / 3;

            // If it has some brightness (meaning it's part of the frame or the letters),
            // we want to make it the target color, while preserving its anti-aliasing (alpha).
            // Since it's a solid colored frame, we can just replace its rgb with the target rgb,
            // and use its relative brightness to determine its alpha so it blends smoothly.

            // Max brightness is approx (targetR + targetG + targetB) / 3
            const maxBrightness = (targetR + targetG + targetB) / 3;

            // Set the color to the target color
            data[i] = targetR;
            data[i + 1] = targetG;
            data[i + 2] = targetB;

            // Adjust alpha based on original brightness to preserve anti-aliased soft edges.
            // If it's the letters (high brightness), alpha is 255.
            // If it's the frame edges (low brightness), alpha is partial.
            // But wait! The frame itself has a solid dark green color, so its brightness is low 
            // even in the solid parts. If we map brightness to alpha, the frame might become semi-transparent!
            // Let's check the original image.

            if (r < 50 && g < 50 && b < 50) {
                // Very dark edge pixel -> anti-aliased transparency
                data[i + 3] = Math.min(255, Math.floor((brightness / 50) * 255));
            } else {
                // Solid part (either the frame or the letters)
                data[i + 3] = 255;
            }
        }

        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
            .png()
            .toFile(outputImagePath);

        console.log('Successfully created updated icon.png');

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
