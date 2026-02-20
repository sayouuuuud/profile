const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is missing in .env.local");
    process.exit(1);
}

console.log(`Testing API Key: ${apiKey.substring(0, 10)}... (Length: ${apiKey.length})`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
                console.log("✅ API Connection Successful!");
                console.log("Available Models:");
                json.models.forEach(m => {
                    const id = m.name.replace('models/', '');
                    if (id.includes('gemini')) {
                        console.log(` - ${id}`);
                    }
                });
            } else {
                console.error("❌ API Error:");
                console.error(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error("Failed to parse response:", data);
        }
    });

}).on('error', (err) => {
    console.error("Network Error:", err.message);
});
