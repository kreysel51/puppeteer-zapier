import express from 'express';
import { chromium } from 'playwright';

const app = express();
app.use(express.json());

app.post('/visit', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`Opening ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Optional: wait for ad iframe (update selector if needed)
    try {
      await page.waitForSelector('iframe[src*="ads"]', { timeout: 10000 });
      console.log('Ad iframe detected.');
    } catch {
      console.log('No ad iframe found.');
    }

    // Wait 5 more seconds
    await page.waitForTimeout(5000);

    const title = await page.title();
    await browser.close();

    res.json({ success: true, title });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Playwright failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});