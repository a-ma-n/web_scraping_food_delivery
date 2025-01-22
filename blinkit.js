import puppeteer, { devices } from "puppeteer";

export const scrapeBlinkit = async (address, product) => {
  const browser = await puppeteer.launch({
    headless: false, // or false, based on your need
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Emulate a mobile device (e.g., Moto G4)
  const motoG4 = devices["Moto G4"];
  await page.emulate(motoG4);

  // URL encode the product name
  product = encodeURIComponent(product);

  // Navigate to Blinkit's website
  await page.goto("https://www.blinkit.com", { waitUntil: "networkidle2" });

  // Handle "Continue on web" modal
  //   await page.waitForSelector('.DownloadAppModal__ContinueLink-sc-1wef47t-12');
  //   await page.click('.DownloadAppModal__ContinueLink-sc-1wef47t-12');

  // Define the timeout duration
  const timeout = 5000; // Timeout in milliseconds (e.g., 5 seconds)

  try {
    // Wait for either the selector or the timeout
    await Promise.race([
      page.waitForSelector(".DownloadAppModal__ContinueLink-sc-1wef47t-12"),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout waiting for modal")),
          timeout
        )
      ),
    ]);

    // Click the "Continue on web" link
    await page.click(".DownloadAppModal__ContinueLink-sc-1wef47t-12");
  } catch (error) {
    console.log("Modal did not appear, proceeding to next step");
    // Proceed to next step if the modal does not appear or times out
  }

  // Click "Select manually" in location modal
  await page.waitForSelector(
    ".GetLocationModal__UseLocation-sc-jc7b49-6.GetLocationModal__SelectManually-sc-jc7b49-7"
  );
  await page.click(
    ".GetLocationModal__UseLocation-sc-jc7b49-6.GetLocationModal__SelectManually-sc-jc7b49-7"
  );

  // Enter the address in location search
  await page.waitForSelector('input[name="select-locality"]');
  await page.type('input[name="select-locality"]', address, { delay: 300 });

  // Select the first location from suggestions
  await page.waitForSelector(
    ".LocationSearchList__LocationListContainer-sc-93rfr7-0"
  );
  await page.evaluate(() => {
    const firstLocationItem = document.querySelector(
      ".LocationSearchList__LocationListContainer-sc-93rfr7-0"
    );
    if (firstLocationItem) firstLocationItem.click();
  });

  // Open a new tab for the product search
  const newTab = await browser.newPage();
  await newTab.goto(`https://blinkit.com/s/?q=${product}`, {
    waitUntil: "networkidle2",
  });

  // Extract product details
  const productDetails = await newTab.evaluate(() => {
    const products = Array.from(
      document.querySelectorAll('div[role="button"][id]')
    );
    return products.map((product) => ({
      title: product
        .querySelector("div.tw-text-300.tw-font-semibold")
        ?.textContent.trim(),
      quantity: product
        .querySelector("div.tw-text-200.tw-font-medium")
        ?.textContent.trim(),
      price: product
        .querySelector("div.tw-text-200.tw-font-semibold")
        ?.textContent.trim(),
      pic: product.querySelector("img.tw-h-full.tw-w-full")?.src,
    }));
  });

  await browser.close();
  return productDetails;
};

// Test the function
// (async () => {
//   const result = await scrapeBlinkit('Kasmanda Regent Apartments', 'amul fullcream');
//   console.log('Result:', result);
// })();
