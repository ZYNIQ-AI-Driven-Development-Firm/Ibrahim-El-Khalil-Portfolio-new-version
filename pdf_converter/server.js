const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const playwright = require('playwright');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.post('/pdf', async (req, res) => {
  const { url, html, options } = req.body || {};
  if (!url && !html) return res.status(400).json({ error: 'Provide url or html in request body' });

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    if (url) {
      await page.goto(url, { waitUntil: 'networkidle' });
    } else {
      await page.setContent(html, { waitUntil: 'networkidle' });
    }

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, ...(options || {}) });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    await browser.close();
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed', details: String(err) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`PDF converter listening on ${port}`));
