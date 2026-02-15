const fetch = require('node-fetch'); // Might need to just use native fetch in Node 18+ or dynamic import

async function testAnalytics() {
  try {
    console.log("Sending test request to analytics API...");
    const response = await fetch('http://localhost:3000/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: '/debug-test-path',
        referrer: 'debug-script'
      })
    });

    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`Body: ${text}`);
  } catch (err) {
    console.error("Request failed:", err);
  }
}

testAnalytics();
