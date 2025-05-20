import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/visit', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    console.log(`Opening ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Optionally wait for known ad selector (example below)
    try {
      await page.waitForSelector('iframe[src*="ads"]', { timeout: 10000 });
      console.log('Ad iframe detected.');
    } catch {
      console.log('No ad iframe found, continuing...');
    }

    // Wait 5 seconds after load
    await new Promise(resolve => setTimeout(resolve, 5000));

    const title = await page.title();
    await browser.close();

    res.json({ success: true, title });

  } catch (err) {
    console.error('Error during Puppeteer session:', err);
    res.status(500).json({ error: 'Puppeteer failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
