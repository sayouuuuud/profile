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

        for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // 25 is a safe threshold for near black
            if (r < 25 && g < 25 && b < 25) {
                data[i + 3] = 0; // Transparent
            } else if (r < 50 && g < 50 && b < 50) {
                // Anti-aliasing edge
                data[i + 3] = 100;
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

        console.log('Successfully created transparent icon.png');

        if (fs.existsSync('d:\\profile\\app\\favicon.ico')) {
            fs.unlinkSync('d:\\profile\\app\\favicon.ico');
            console.log('Removed competing favicon.ico');
        }

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

processImage();
