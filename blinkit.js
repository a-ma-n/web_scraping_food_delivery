import puppeteer from 'puppeteer';
(async () => {
    const address = 'Kasmanda regent apartment'
    const product = "amul%20fullcream"

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

  // Wait for the location input, type the location
  await page.waitForSelector('input[name="select-locality"]');
  await page.type('input[name="select-locality"]', address, { delay: 300 });

  // Select the first location suggestion
  await page.waitForSelector('.LocationSearchList__LocationListContainer-sc-93rfr7-0');
  await page.evaluate(() => {
    const firstLocationItem = document.querySelector('.LocationSearchList__LocationListContainer-sc-93rfr7-0');
    if (firstLocationItem) firstLocationItem.click();
  });

  const newTab = await browser.newPage();

  // Set the address with the search query
  await newTab.goto('https://blinkit.com/s/?q='+product, { waitUntil: 'networkidle2' });
  
  // Wait for the animated search suggestions to appear
  //   await newTab.waitForSelector('.SearchBar__AnimationWrapper-sc-16lps2d-1');
  
  // Wait for the search results to load
  //   await newTab.waitForSelector('[data-pf="reset"]'); // Waiting for product containers to load
  await page.waitForTimeout(3000);
  
  // Extract product details
  // Extract the entire HTML of the search results section
  const entireHTML = await newTab.evaluate(() => {
    const resultContainer = document.querySelector('.BffSearchMobile__ResultContainer-sc-6lzqz5-4'); // Make sure this is the correct selector for the full product grid
    return resultContainer ? resultContainer.outerHTML : '';
  });

//   console.log(entireHTML);

  // Open a new page to render the whole HTML content
  const resultTab = await browser.newPage();

  // Render the entire HTML content in the new tab
  await resultTab.setContent(entireHTML);

  // Wait a few seconds to view the rendered page
  await resultTab.waitForTimeout(5000);

  // issue with prices showing up in white in html
  
//  await browser.close();
})();

