import puppeteer from 'puppeteer';

function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}

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

  await delay(3000);

  // const pageList = await browser.pages();
  // console.log(pageList);

  // await pageList[0].close();
  // console.log(newPageList);

  const newPageList = await browser.pages();

  const page = newPageList[1];

  page.bringToFront();

  await delay(3000);

  const elementImportRecoveryPharseButton = await page.waitForSelector('button[data-testid=import-recovery-phrase-button]',{
    timeout : 20000
  });

  elementImportRecoveryPharseButton.click();

  await page.waitForSelector('input[data-testid=secret-recovery-phrase-word-input-0]',{
    timeout : 20000
  });

  const pharse = "champion leaf tuna mesh behave situate display uncle merit waste peasant dinner".split(" ");
  
  for (const [indexPharse,valuePharse] of pharse.entries()) {    
    await page.type('input[data-testid=secret-recovery-phrase-word-input-' + indexPharse + ']', valuePharse);

    // await page.$eval('input[data-testid=secret-recovery-phrase-word-input-' + indexPharse + ']', (el,value) => el.value = value,valuePharse);
  }

  const elementImportWallet = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 20000
  });

  elementImportWallet.click();

  await delay(3000);

  const elementContinue = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 20000
  });

  elementContinue.click();

  await page.waitForSelector('input[data-testid=onboarding-form-password-input]',{
    timeout : 20000
  });

  await page.type('input[data-testid=onboarding-form-password-input]', "12345678910");

  await page.type('input[data-testid=onboarding-form-confirm-password-input]', "12345678910");

  await page.$eval('input[data-testid=onboarding-form-terms-of-service-checkbox]', (el) => el.click());

  const elementSubmitPassword = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 20000
  });

  elementSubmitPassword.click();

  await delay(3000);

  const elementGetStarted = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 20000
  });

  elementGetStarted.click();

  await newPageList[0].bringToFront();

  await delay(3000);

  const lastPage = await browser.newPage();

  await lastPage.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);

  // setTimeout(async () => {
  //   await browser.close();
  // },5000);
})();