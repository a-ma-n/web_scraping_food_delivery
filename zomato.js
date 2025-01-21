import puppeteer from "puppeteer";
import fs from "fs";

export const scrapeZomato = async (address, dish) => {
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

  await page.waitForTimeout(5000);

  const productData = await page.evaluate(() => {
    // Select parent elements (h4 tags with height="13rem")
    const parents = Array.from(
      document.querySelectorAll('div[height="13rem"]')
    );

    console.log(parents);

    return parents
      .map((parent) => {
        // Find the child <img> element within the parent
        const img = parent.querySelector("img");
        if (!img) return null; // Return null if no img is found

        // Extract title and image source from the img element
        const pic = img.src;
        const title =
          parent.parentElement.nextElementSibling.childNodes[0].childNodes[0]
            .childNodes[0].innerHTML;

        // const rating = parent.parentElement.nextElementSibling.childNodes[0].childNodes[0].childNodes[1].innerHTML;

        //parent = document.querySelectorAll('div[height="13rem"]')

        const priceParent =
          parent.parentElement.nextElementSibling.childNodes[0].childNodes[0]
            .childNodes[2];
        const price =
          priceParent.querySelector("span") != null
            ? priceParent.querySelector("span").innerHTML
            : "n/a";
        const description =
          parent.parentElement.nextElementSibling.childNodes[1].innerHTML;

        // Find the sibling element that contains the price (e.g., a span inside the next element)
        // const priceElement = parent.nextElementSibling?.querySelector("span"); // Adjust based on your HTML structure
        // const price = priceElement ? priceElement.innerText.trim() : null;

        // Return the product data, ensuring price and title are valid
        if (title && price) {
          return { title, price, pic, description };
        }

        return null; // Return null if data is incomplete
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
  await browser.close();
  return productData;
};

// Running the function to view results
// (async () => {
//   const result = await scrapeZomato(
//     "Kasmanda Regent Apartments lucknow",
//     "tunday"
//   );
//   console.log("Result:", result);
// })();
