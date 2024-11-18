import {scrapeBlinkit} from './blinkit.js';
import { scrapeZepto } from './zepto.js';

const address = "Kasmanda regent apartment"
const product = "amul fullcream"

scrapeBlinkit(address, product);
scrapeZepto(address,product);

