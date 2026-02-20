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

        // Find the bright green target color
        for (let i = 0; i < data.length; i += info.channels) {
            if (data[i + 1] > maxGreen) {
                maxGreen = data[i + 1];
                targetR = data[i];
                targetG = data[i + 1];
                targetB = data[i + 2];
            }
        }

        // Extract JUST the letters and color them black
        const letterData = Buffer.alloc(data.length);
        for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // If it's the bright green letters
            if (a > 10 && g > 100 && r < 100) {
                letterData[i] = 0;
                letterData[i + 1] = 0;
                letterData[i + 2] = 0;
                letterData[i + 3] = a > 200 ? 255 : a; // keep smooth aliasing
            } else {
                // Transparent
                letterData[i] = 0;
                letterData[i + 1] = 0;
                letterData[i + 2] = 0;
                letterData[i + 3] = 0;
            }
        }

        // 1. Get the tightly cropped letters
        const trimmedLettersBuffer = await sharp(letterData, {
            raw: { width: info.width, height: info.height, channels: info.channels }
        })
            .trim({ threshold: 0 })
            .toBuffer({ resolveWithObject: true });

        // 2. High-res final canvas size
        const finalSize = 512;

        // Calculate new size (40% increase in proportion)
        const origRatio = trimmedLettersBuffer.info.width / info.width;
        let newRatio = origRatio * 1.4; // 40% increase
        if (newRatio > 0.85) newRatio = 0.85; // Leave at least some padding

        const targetLetterWidth = Math.round(finalSize * newRatio);

        // 3. Resize letters smoothly to the new size
        const resizedLetters = await sharp(trimmedLettersBuffer.data, {
            raw: {
                width: trimmedLettersBuffer.info.width,
                height: trimmedLettersBuffer.info.height,
                channels: trimmedLettersBuffer.info.channels
            }
        })
            .resize(targetLetterWidth, null, { kernel: 'mitchell' })
            .png()
            .toBuffer();

        // 4. Create base green canvas (512x512)
        const baseCanvas = await sharp({
            create: {
                width: finalSize,
                height: finalSize,
                channels: 4,
                background: { r: targetR, g: targetG, b: targetB, alpha: 255 }
            }
        })
            // 5. Composite letters onto the center of the green canvas
            .composite([{
                input: resizedLetters,
                gravity: 'center'
            }])
            .png()
            .toBuffer();

        // 6. Draw rounded corners mask (18% of 512 = 92) for a sleek squarcle
        const rx = Math.round(finalSize * 0.18);
        const svgMaskString = `
      <svg width="${finalSize}" height="${finalSize}" viewBox="0 0 ${finalSize} ${finalSize}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${finalSize}" height="${finalSize}" rx="${rx}" fill="#fff"/>
      </svg>`;

        const maskBuffer = await sharp(Buffer.from(svgMaskString)).png().toBuffer();

        // 7. Composite mask using dest-in to cut the corners
        await sharp(baseCanvas)
            .composite([{
                input: maskBuffer,
                blend: 'dest-in'
            }])
            .png()
            .toFile(outputImagePath);

        console.log(`Successfully created enlarged letters icon.png`);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
