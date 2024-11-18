import express from 'express';
import puppeteer from 'puppeteer';
import { scrapeBlinkit } from './blinkit.js';
import { scrapeZepto } from './zepto.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json()); // To parse JSON request bodies

const port = 3000;

// Get the current directory using import.meta.url and fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zepto API
app.post('/zepto', async (req, res) => {
  const { address, product } = req.body;
  try {
    const result = await scrapeZepto(address, product);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error scraping Zepto');
  }
});

// Blinkit API
app.post('/blinkit', async (req, res) => {
  const { address, product } = req.body;
  try {
    const result = await scrapeBlinkit(address, product);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error scraping Blinkit');
  }
});

// Serve the HTML file for the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
