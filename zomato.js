import puppeteer from "puppeteer";

export const scrapeZomato = async (address, dish) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const website = "zomato: ";

    console.log(website, "site opening");
    await page.goto("https://www.zomato.com", { waitUntil: "networkidle2" });

    console.log(website, "filling address");
    await page.waitForSelector("input");
    await page.click("input");

    console.log(website, "typing address");
    await page.type("input", address, { delay: 100 });

    console.log(website, "clicking on order online");
    await page.waitForSelector('img[alt="Order Online"]', { timeout: 10000 });
    await page.click('img[alt="Order Online"]');

    console.log(website, "clicking on search bar");
    await page.waitForSelector(
      'input[placeholder="Search for restaurant, cuisine or a dish"]',
      { timeout: 15000 }
    );
    await page.click(
      'input[placeholder="Search for restaurant, cuisine or a dish"]'
    );
    await page.type(
      'input[placeholder="Search for restaurant, cuisine or a dish"]',
      dish,
      { delay: 100 }
    );

    console.log(website, "clicking on the first dish");
    await page.waitForSelector('img[alt="Dish"]', { timeout: 10000 });
    await page.click('img[alt="Dish"]');

    console.log(website, "clicking on the restaurant card");
    await page.waitForSelector('img[alt="Restaurant Card"]', {
      timeout: 10000,
    });
    await page.click('img[alt="Restaurant Card"]');

    console.log(website, "getting product data");
    const productData = await page.evaluate(() => {
      try {
        return Array.from(document.querySelectorAll('div[height="13rem"]'))
          .map((parent) => {
            const img = parent.querySelector("img");
            if (!img) return null;

            const titleElement =
              parent.parentElement.nextElementSibling?.childNodes[0]
                ?.childNodes[0]?.childNodes[0];
            const priceElement =
              parent.parentElement.nextElementSibling?.childNodes[0]
                ?.childNodes[0]?.childNodes[2];
            const descElement =
              parent.parentElement.nextElementSibling?.childNodes[1];

            return {
              title: titleElement?.innerHTML?.trim(),
              price:
                priceElement?.querySelector("span")?.innerHTML?.trim() || "n/a",
              pic: img.src,
              description: descElement?.innerHTML?.trim(),
            };
          })
          .filter((item) => item && item.title && item.price);
      } catch (e) {
        console.error("Evaluation error:", e);
        return [];
      }
    });

    await browser.close();
    return { data: productData };
  } catch (error) {
    let screenshot = null;
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          screenshot = await pages[0].screenshot({
            encoding: "base64",
            fullPage: true,
          });
        }
      } catch (screenshotError) {
        console.error("Failed to capture screenshot:", screenshotError);
      } finally {
        await browser.close();
      }
    }
    return {
      error: error.message,
      screenshot,
      stack: error.stack,
    };
  }
};

(async () => {
  const result = await scrapeZomato(
    "Kasmanda Regent Apartments lucknow",
    "tunday"
  );
  if (result.data) {
    console.log("Success:", result.data);
  } else {
    console.error("Error:", result.error);
    console.log("Screenshot available:", !!result.screenshot);
  }
})();
