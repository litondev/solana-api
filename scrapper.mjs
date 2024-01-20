import puppeteer from 'puppeteer';

(async () => {
    const EXTENSION_PATH = 'C:\\Users\\ACER\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\bfnaelmomeimhlpmgjnjophhpkkoljpa\\23.19.0_0'
    const EXTENSION_ID = 'bfnaelmomeimhlpmgjnjophhpkkoljpa';

  const browser = await puppeteer.launch({
    headless : false,
    args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`
    ]
  });
  const page = await browser.newPage();

  await page.setViewport({width: 1080, height: 1024});

  await browser.close();
})();