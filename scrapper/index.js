import express from 'express';
import puppeteer from 'puppeteer-core';

const app = express();
app.use(express.json());

app.post('/visit', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    

    const page = await browser.newPage();
    await page.setUserAgent(
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
);
    await page.setExtraHTTPHeaders({
  'Accept-Language': 'en-US,en;q=0.9',
});
await page.goto(url, {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
    await page.waitForTimeout(5000);

    const title = await page.title();
    await browser.close();

    res.json({ success: true, title });
  } catch (err) {
    console.error('Puppeteer error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
