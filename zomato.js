import puppeteer from "puppeteer";
import fs from "fs";

export const scrapeSwiggy = async (address, dish) => {
  const browser = await puppeteer.launch({
    headless: false, // or false, based on your need
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto("https://www.zomato.com");
  console.log("site opened");
  await page.waitForTimeout(2000);
  await page.waitForSelector("input");
  await page.click("input");
  //   await page.click('input[placeholder="Enter your delivery location"]');
  await page.type("input", address, { delay: 100 });
  //   await page.click('input[placeholder="Enter your delivery location"]', address, { delay: 100 });

  console.log("typed address");

  //   await page.evaluate(() => {
  //     const firstAddress = document.querySelector('span[class="_2OORn"]');
  //     console.log("address:"+firstAddress)
  //     if (firstAddress) {
  //       firstAddress.click();
  //     }
  //   });
  await page.waitForTimeout(4000);
  await page.waitForSelector('img[alt="Order Online"]');
  await page.click('img[alt="Order Online"]');
  await page.click('img[alt="Order Online"]');

  await page.waitForTimeout(8000);

  await page.click(
    'input[placeholder="Search for restaurant, cuisine or a dish"]'
  );
  await page.type(
    'input[placeholder="Search for restaurant, cuisine or a dish"]',
    dish,
    { delay: 100 }
  );

  await page.waitForTimeout(6000);

  //clciked on 1st search recom
  await page.click('img[alt="Dish"]');
  console.log("Searched");

  //   await page.goto('https://www.swiggy.com/search?query='+dish);
  await page.waitForTimeout(5000);

  await page.waitForSelector('img[alt="Restaurant Card"]');
  await page.click('img[alt="Restaurant Card"]');

  console.log("menu appeared");

  //   await page.click('span[data-testid="DISH-nav-tab-pl"]');

  //   console.log("clicked on dish")

  //   await page.waitForTimeout(10000);
  // //   await page.waitForSelector('div[class="_3orhj _3-C0H"]');
  // console.log("reading pg data")

  // // return Array.from(page.querySelectorAll('div[class="Search_widgetsV2__27BBR Search_widgets__3o_bA Search_widgetsFullLength__2lPs9"]')); // Adjust this selector

  const productData = await page.evaluate(() => {
    //use closest to get the parent and childeren to get the child

    const parents = Array.from(
      document.querySelectorAll('h4[height="13rem"]') // img tag inside has img
    );

    let index = 0; // Ensure index starts at 0
    return products
      .map((product) => {
        //   const content = product.textContent.trim().split(".");
        //   if (content.length >= 5) { // Ensure content has enough parts
        const pic = parents[index][1].src;
        const title = parents[index][1].alt;

        // can we use this val to search for the h4 having this and find that tag; its sibling will have the price
        // const parent = closest(document.querySelectorAll('h4[innerText="'+title+'"')) // img tag inside has img
        // childCost = parent.lastChild.span.innerText
        index += 1;
        return { title, price, pic };
        //   }
        //   return null; // Return null if content is invalid
      })
      .filter((item) => item !== null); // Filter out null values
  });

  await page.waitForTimeout(2000);
  console.log("Extracted Product Data:", productData);

  await page.waitForTimeout(2000);
  console.log(productData);

  console.log("data", productData);

  //   fs.writeFileSync('productData.json', JSON.stringify(productData, null, 2));

  //   console.log('Product data saved to productData.json');
  //   await browser.close();
  return productData;
};

// Running the function to view results
(async () => {
  const result = await scrapeSwiggy(
    "Kasmanda Regent Apartments lucknow",
    "tunday"
  );
  console.log("Result:", result);
})();
