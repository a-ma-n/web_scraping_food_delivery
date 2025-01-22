import puppeteer from "puppeteer";
import fs from "fs";

export const scrapeSwiggy = async (address, dish) => {
  const browser = await puppeteer.launch({
    headless: false, // or false, based on your need
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const website = "swiggy: ";
  const websiteScreenshot = "swiggy/";
  const page = await browser.newPage();

  await page.goto("https://www.swiggy.com");
  console.log(website, "site opened");
  await page.waitForTimeout(2000);
  console.log(website, "entering delivery location");
  await page.waitForSelector(
    'input[placeholder="Enter your delivery location"]'
  );
  await page.click('input[placeholder="Enter your delivery location"]');
  //   await page.click('input[placeholder="Enter your delivery location"]');

  console.log(website, "typing address");
  await page.type(
    'input[placeholder="Enter your delivery location"]',
    address,
    { delay: 100 }
  );

  console.log(website, "typed address");

  //   await page.evaluate(() => {
  //     const firstAddress = document.querySelector('span[class="_2OORn"]');
  //     console.log("address:"+firstAddress)
  //     if (firstAddress) {
  //       firstAddress.click();
  //     }
  //   });
  await page.waitForTimeout(2000);
  console.log(website, " clickin on the 1st address");
  await page.click('span[class="_2OORn"]');
  await page.waitForTimeout(3000);

  console.log(website, "open new search page ");
  await page.goto("https://www.swiggy.com/search?query=" + dish);
  await page.waitForTimeout(5000);

  await page.waitForSelector('span[data-testid="DISH-nav-tab-pl"]');

  await page.screenshot({ path: "screenshot.png" });

  console.log(website, "dish appeared");
  await page.click('span[data-testid="DISH-nav-tab-pl"]');

  console.log(website, "clicked on dish");

  await page.waitForTimeout(10000);
  //   await page.waitForSelector('div[class="_3orhj _3-C0H"]');
  console.log(website, "reading pg data");

  // return Array.from(page.querySelectorAll('div[class="Search_widgetsV2__27BBR Search_widgets__3o_bA Search_widgetsFullLength__2lPs9"]')); // Adjust this selector

  const productData = await page.evaluate(() => {
    const products = Array.from(
      document.querySelectorAll(
        'p[class="ScreenReaderOnly_screenReaderOnly___ww-V"]'
      )
    );
    const images = Array.from(
      document.querySelectorAll('img[class="styles_itemImage__DHHqs"]')
    );

    console.log(" product Data:", products);
    console.log(" image Data:", images);

    const dishes = Array.from(
      document.querySelectorAll('div[data-testid="normal-dish-item"]')
    );

    let index = 0;
    return dishes
      .map((dish) => {
        const title =
          dish?.childNodes[0].childNodes[1].childNodes[1].textContent;
        const price = dish?.childNodes[0].childNodes[1].childNodes[2].innerText;
        const pic = images[index]?.src;
        index += 1;
        return { title, price, pic };
        // const description = dishes[index].childNodes[0].childNodes[1].childNodes[2].innerText;
      })
      .filter((item) => item !== null); // Filter out null values

    // let index = 0; // Ensure index starts at 0
    // return products
    //   .map((product) => {
    //     const content = product.textContent.trim().split(".");
    //     // if (content.length >= 5) {
    //     // Ensure content has enough parts
    //     const title = content[1] || "No title";
    //     const pic = images[index]?.src || "No image"; // Use optional chaining
    //     const price = content[3] || "No price";
    //     const description = content[4] || "No description";

    //     index += 1;
    //     return { title, description, price, pic, product };
    //     // }
    //     // return null; // Return null if content is invalid
    //   })
    //   .filter((item) => item !== null); // Filter out null values
  });

  await page.waitForTimeout(2000);
  // console.log(website, "Extracted Product Data:", productData);

  await page.waitForTimeout(2000);
  // console.log(website, productData);

  // console.log(website, "data", productData);

  //   fs.writeFileSync('productData.json', JSON.stringify(productData, null, 2));

  //   console.log('Product data saved to productData.json');
  await browser.close();
  return productData;
};

// Running the function to view results
// (async () => {
//   const result = await scrapeSwiggy("Kasmanda Regent Apartments", "tunday");
//   console.log("Result:", result);
// })();
