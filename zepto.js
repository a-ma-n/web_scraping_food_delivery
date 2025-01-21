import puppeteer from 'puppeteer';
import fs from 'fs';

export const scrapeZepto = async (address, product) => {
    const browser = await puppeteer.launch({
        headless: "new", // or false, based on your need
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  const page = await browser.newPage();

  // Navigate to the ZeptoNow website
  await page.goto('https://www.zeptonow.com');
  console.log("site opened")
  await page.waitForTimeout(2000);
//   console.log("entered website")
//   await page.screenshot({ path: 'screenshot.png' });
  // Click the "Type manually" button
  
  await page.waitForSelector('span[data-testid="user-address"]');

  await page.click('span[data-testid="user-address"]');
  console.log("button click")

//   console.log("Click the Type manually button")
  await page.waitForSelector('input[placeholder="Search a new address"]');
  await page.type('input[placeholder="Search a new address"]', address, { delay: 100 });
  await page.waitForTimeout(4000);
  console.log("address entered")
  await page.waitForSelector('div[data-testid="address-search-item"]');
  await page.evaluate(() => {
    const firstAddress = document.querySelector('div[data-testid="address-search-item"]');
    if (firstAddress) {
      firstAddress.click();
    }
  });
  await page.waitForTimeout(2000);
  await page.waitForSelector('button[data-testid="location-confirm-btn"]');
  await page.click('button[data-testid="location-confirm-btn"]');

  
//   await page.screenshot({ path: 'screenshot2.png' });
const timeout = 5000; // Timeout duration in milliseconds (e.g., 5 seconds)

try {
    // Wait for either the selector or the timeout
    await Promise.race([
      page.waitForSelector('button[data-testid="manual-address-btn"]'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for modal')), timeout))
    ]);
    
    // Click the "Continue on web" link
    await page.click('button[data-testid="manual-address-btn"]');
// console.log("Clicked the 'Type manually' button");
// await page.waitForTimeout(2000);

// Enter address in the search input
await waitForSelectorWithTimeout(page, 'input[placeholder="Search a new address"]', timeout);
await page.type('input[placeholder="Search a new address"]', address, { delay: 100 });
await page.waitForTimeout(2000);

// Select the first address
await waitForSelectorWithTimeout(page, 'h4.font-heading.line-clamp-1', timeout);
await page.evaluate(() => {
  const firstAddress = document.querySelector('h4.font-heading.line-clamp-1');
  if (firstAddress) {
    firstAddress.click();
  }
});
  } catch (error) {
    console.log('Modal did not appear, proceeding to next step');
    // Proceed to next step if the modal does not appear or times out
  }

  await page.waitForTimeout(2000);
  await page.waitForSelector('a[data-testid="search-bar-icon"]');
  await Promise.all([
    page.click('a[data-testid="search-bar-icon"]'),
    await page.waitForTimeout(2000),
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
      const pic = product.querySelector('img[data-testid="product-card-image"]').src;
      const quantity = product.querySelector('h4.font-heading').textContent.trim();
      const price = product.querySelector('h4[data-testid="product-card-price"]')?.textContent.trim();
      return { title, quantity, price, pic };
    });
  });

//   fs.writeFileSync('productData.json', JSON.stringify(productData, null, 2));

//   console.log('Product data saved to productData.json');
  await browser.close();
  return productData;
};






// Running the function to view results
(async () => {
  const result = await scrapeZepto('Kasmanda Regent Apartments', 'amul fullcream');
  console.log('Result:', result);
})();
