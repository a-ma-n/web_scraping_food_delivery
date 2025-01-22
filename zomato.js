import puppeteer from "puppeteer";
import fs from "fs";

export const scrapeZomato = async (address, dish) => {
  const browser = await puppeteer.launch({
    headless: false, // or false, based on your need
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const website = "zomato: ";
  const websiteScreenshot = "zomato/";

  console.log(website, "site opening");

  await page.goto("https://www.zomato.com");
  await page.waitForTimeout(2000);
  console.log(website, "filling address");

  await page.waitForSelector("input");
  await page.click("input");
  console.log(website, "typing address");

  await page.type("input", address, { delay: 100 });

  console.log(website, "clicking on order online");

  await page.waitForTimeout(4000);
  await page.waitForSelector('img[alt="Order Online"]');
  await page.click('img[alt="Order Online"]');
  await page.click('img[alt="Order Online"]');

  await page.waitForTimeout(8000);
  console.log(website, "clickin on search bar ");

  await page.screenshot({ path: websiteScreenshot + "screenshot.png" });

  await page.click(
    'input[placeholder="Search for restaurant, cuisine or a dish"]'
  );
  await page.type(
    'input[placeholder="Search for restaurant, cuisine or a dish"]',
    dish,
    { delay: 100 }
  );

  await page.waitForTimeout(6000);

  console.log(website, "clicking on the first dish");

  await page.click('img[alt="Dish"]');
  console.log("Searched");

  await page.waitForTimeout(5000);

  console.log(website, "clicking on the restaurant card");

  await page.waitForSelector('img[alt="Restaurant Card"]');
  await page.click('img[alt="Restaurant Card"]');

  console.log("menu appeared");

  await page.waitForTimeout(5000);

  console.log(website, "getting product data");

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

        const pic = img.src;
        const title =
          parent.parentElement.nextElementSibling.childNodes[0].childNodes[0]
            .childNodes[0].innerHTML;

        const priceParent =
          parent.parentElement.nextElementSibling.childNodes[0].childNodes[0]
            .childNodes[2];
        const price =
          priceParent.querySelector("span") != null
            ? priceParent.querySelector("span").innerHTML
            : "n/a";
        const description =
          parent.parentElement.nextElementSibling.childNodes[1].innerHTML;

        if (title && price) {
          return { title, price, pic, description };
        }

        return null; // Return null if data is incomplete
      })
      .filter((item) => item !== null); // Filter out null values
  });

  await page.waitForTimeout(2000);
  console.log(website, "Extracted Product Data:", productData);

  await page.waitForTimeout(2000);
  console.log(website, productData);

  console.log(website, "data", productData);

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
