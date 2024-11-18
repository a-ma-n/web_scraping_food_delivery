import { scrapeBlinkit } from './blinkit.js';
import { scrapeZepto } from './zepto.js';

// Function to parse command line arguments manually
const parseArgs = () => {
  const args = process.argv.slice(2);
  const addressArg = args.find(arg => arg.startsWith('-address='))?.split('=')[1];
  const productArg = args.find(arg => arg.startsWith('-product='))?.split('=')[1];

  return {
    address: addressArg || 'Kasmanda regent Apartments',  // Provide a default if not passed
    product: productArg || 'Amul Gold Full cream',  // Provide a default if not passed
  };
};

const { address, product } = parseArgs();

console.log(`Address: ${address}`);
console.log(`Product: ${product}`);

// Run the scraping functions and await their responses
(async () => {
  try {
    const blinkitResults = await scrapeBlinkit(address, product);
    const zeptoResults = await scrapeZepto(address, product);

    console.log('Blinkit Results:', blinkitResults);
    console.log('Zepto Results:', zeptoResults);
  } catch (error) {
    console.error('Error scraping data:', error);
  }
})();
