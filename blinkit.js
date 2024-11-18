import puppeteer from 'puppeteer';

const scrapeBlinkit = async (address, product) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to Blinkit's website
  await page.goto('https://www.blinkit.com', { waitUntil: 'networkidle2' });

  // Wait for and click the "Continue on web" button
  await page.waitForSelector('.DownloadAppModal__ContinueLink-sc-1wef47t-12');
  await page.click('.DownloadAppModal__ContinueLink-sc-1wef47t-12');

  // Click "Select manually"
  await page.waitForSelector('.GetLocationModal__UseLocation-sc-jc7b49-6.GetLocationModal__SelectManually-sc-jc7b49-7');
  await page.click('.GetLocationModal__UseLocation-sc-jc7b49-6.GetLocationModal__SelectManually-sc-jc7b49-7');

  // Wait for the location input, type the address
  await page.waitForSelector('input[name="select-locality"]');
  await page.type('input[name="select-locality"]', address, { delay: 300 });

  // Select the first location suggestion
  await page.waitForSelector('.LocationSearchList__LocationListContainer-sc-93rfr7-0');
  await page.evaluate(() => {
    const firstLocationItem = document.querySelector('.LocationSearchList__LocationListContainer-sc-93rfr7-0');
    if (firstLocationItem) firstLocationItem.click();
  });

  // Open a new tab for the product search
  const newTab = await browser.newPage();
  await newTab.goto(`https://blinkit.com/s/?q=${product}`, { waitUntil: 'networkidle2' });

  // Wait for results to load
  await newTab.waitForTimeout(3000);

  // Get the list of all open pages (tabs)
  const allPages = await browser.pages();

  // Close all tabs except the last one
  for (const page of allPages) {
    if (page !== newTab) {
      await page.close(); // Close the tab
    }
  }

  // Wait for the last tab to finish any tasks (optional)
  await newTab.waitForTimeout(5000);

  

  // Optional: Close the browser after reviewing
  // await browser.close();
};

// Example usage
scrapeBlinkit('Kasmanda regent apartment', 'amul%20fullcream');
