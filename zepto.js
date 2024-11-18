import puppeteer from 'puppeteer';
import fs from 'fs';

export const scrapeZepto = async (address, product) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the ZeptoNow website
  await page.goto('https://www.zeptonow.com');
  await page.waitForTimeout(2000);

  // Click the "Type manually" button
  await page.waitForSelector('button[data-testid="manual-address-btn"]');
  await page.click('button[data-testid="manual-address-btn"]');

  // Enter address
  await page.waitForSelector('input[placeholder="Search a new address"]');
  await page.type('input[placeholder="Search a new address"]', address, { delay: 100 });

  await page.waitForTimeout(2000);
  await page.waitForSelector('h4.font-heading.line-clamp-1');
  await page.evaluate(() => {
    const firstAddress = document.querySelector('h4.font-heading.line-clamp-1');
    if (firstAddress) {
      firstAddress.click();
    }
  });

  await page.waitForTimeout(2000);
  await page.waitForSelector('button[data-testid="location-confirm-btn"]');
  await page.click('button[data-testid="location-confirm-btn"]');

  await page.waitForTimeout(2000);
  await page.waitForSelector('a[data-testid="search-bar-icon"]');
  await Promise.all([
    page.click('a[data-testid="search-bar-icon"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  const searchComponent = await page.waitForXPath(
    '//input[@placeholder="Search for over 5000 products"]'
  );
  await searchComponent.click();
  await searchComponent.type(product, { delay: 100 });
  await page.keyboard.press('Enter');

  await page.waitForTimeout(2000);
  await page.waitForSelector('a[data-testid="product-card"]');

  const productData = await page.evaluate(() => {
    const products = Array.from(document.querySelectorAll('a[data-testid="product-card"]'));
    return products.map(product => {
      const title = product.querySelector('h5.font-subtitle').textContent.trim();
      const image = product.querySelector('img[data-testid="product-card-image"]').src;
      const quantity = product.querySelector('h4.font-heading').textContent.trim();
      const price = product.querySelector('h4[data-testid="product-card-price"]')?.textContent.trim();
      return { title, image, quantity, price };
    });
  });

//   fs.writeFileSync('productData.json', JSON.stringify(productData, null, 2));

//   console.log('Product data saved to productData.json');
  await browser.close();
  return productData;
};

// // Running the function to view results
(async () => {
  const result = await scrapeZepto('Kasmanda Regent Apartments', 'amul fullcream');
  console.log('Result:', result);
})();
