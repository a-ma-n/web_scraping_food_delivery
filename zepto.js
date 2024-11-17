import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const address ="Kasmanda Regent Apartments";
  const product ="'amul fullcream'";

  // Navigate to the ZeptoNow website
  await page.goto('https://www.zeptonow.com', { waitUntil: 'networkidle2' });

  // Click the "Type manually" button
  await page.waitForSelector('button[data-testid="manual-address-btn"]');
  await page.click('button[data-testid="manual-address-btn"]');
  console.log('Button clicked!');

  // Wait and type in the search input
//   await page.waitForTimeout(5000);
  await page.waitForSelector('input[placeholder="Search a new address"]');
  await page.type('input[placeholder="Search a new address"]', address, { delay: 100 });
  console.log('Typed into the input field!');

  // Wait for the results to load and click the matching result
  await page.waitForTimeout(2000);
  await page.waitForSelector('h4.font-heading.line-clamp-1');
  await page.evaluate(() => {
    const target = Array.from(document.querySelectorAll('h4.font-heading.line-clamp-1'))
      .find(element => element.textContent.trim() === 'Kasmanda Regent Apartments');
    if (target) target.click();
  });
  console.log('Clicked on "Kasmanda Regent Apartments"!');

  // Wait for the "Confirm & Continue" button and click it
  await page.waitForTimeout(2000);
await page.waitForSelector('button[data-testid="location-confirm-btn"]');
await page.click('button[data-testid="location-confirm-btn"'); 
console.log('Clicked on "Confirm & Continue"!');

  // Optionally wait or perform additional actions
  await page.waitForTimeout(000);


 // Wait for the search bar and click it
  await page.waitForSelector('a[data-testid="search-bar-icon"]');
await Promise.all([
    page.click('a[data-testid="search-bar-icon"]'), // Click search bar
    page.waitForNavigation({ waitUntil: 'networkidle2' }) // Wait for new page load
  ]);

  console.log('Navigated to the search page!');

  // Wait for the search box to appear on the new page
//  await page.waitForSelector('input[data-testid="searchBar"]', { visible: true });

  // Type "Amul milk fullcream" into the search box
 // await page.type('input[data-testid="searchBar"]', 'Amul milk fullcream', { delay: 100 });
// Wait for the search input field to appear on the new page
(async () => {
    // Wait for the element containing the placeholder text to appear on the page
    const searchComponent = await page.waitForXPath(
      '//input[@placeholder="Search for over 5000 products"]'
    );
  
    // Click on the search input field
    await searchComponent.click();
  
    // Type "amul fullcream" into the search box
    await searchComponent.type(product, { delay: 100 });
  
    // Simulate pressing Enter to submit the search
    await page.keyboard.press('Enter');

    // Wait for the search results to load
    await page.waitForSelector('[data-testid="product-card"]', { visible: true });

    // Extract the parent HTML of the elements with data-testid="product-card"
    const iframeContent = await page.evaluate(() => {
        const parents = Array.from(document.querySelectorAll('[data-testid="product-card"]'))
          .map(el => el.parentElement.outerHTML);
        
        return parents.join('');
      });
    
      console.log('Extracted content for iframe.');
    

    const newPage = await browser.newPage();
    await newPage.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Product Results</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
            </style>
          </head>
          <body>
            <h1>Product Results</h1>
            <div id="product-container"></div>
            <script>
              // Inject the iframe content
              document.getElementById('product-container').innerHTML = \`${iframeContent.replace(/`/g, '\\`')}\`;
            </script>
          </body>
        </html>
      `);
  console.log('Iframe content loaded in new page.');
  })();
  
  
  
//  await browser.close();
})();

