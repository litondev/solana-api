import puppeteer from 'puppeteer';
import recovery_pharse from './pharse.json' assert { type: "json" };

// import pharse 
// swap token

// UNTUK MENUNGGU BEBERAPA DETIK DEFUALT 3 DETIK
function delay(time = 3000) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}

(async () => {
  // EXTENSION_PATH
  const EXTENSION_PATH = 'C:\\Users\\ACER\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\bfnaelmomeimhlpmgjnjophhpkkoljpa\\23.19.0_0'
  // EXTENSION_ID
  const EXTENSION_ID = 'bfnaelmomeimhlpmgjnjophhpkkoljpa';

  // INSTALASI BROWSER
  const browser = await puppeteer.launch({
    headless : false,
    args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        "--no-sandbox",
    ],
    // ignoreHTTPSErrors: true,
    // defaultViewport: {
    //   width: 400,
    //   height: 700,
    //   isMobile: true,
    // }
  });

  // TUNGGU SEMUA KE LOAD
  await delay();

  // AMBIL SEMUA TAB
  // const pageList = await browser.pages();
  // console.log(pageList);

  // TUTUP TAB NOMOR 1
  // await pageList[0].close();
  // console.log(newPageList);

  // AMBIL SEMUA TAB 
  const newPageList = await browser.pages();
  // AMBIL TAB NOMOR 2
  const page = newPageList[1];
  // TAMPILKAN DI PALING DEPAN
  await page.bringToFront();

  // TUNGGU AGAR SEMUA DI PROSES
  await delay();

  // TUNGGU TOMBOL IMPORT PHARSE 
  const elementImportRecoveryPharseButton = await page.waitForSelector('button[data-testid=import-recovery-phrase-button]',{
    timeout : 30000
  });

  // LALU CLICK
  await elementImportRecoveryPharseButton.click();

  // TUNGGU INPUTAN PHARSE 
  await page.waitForSelector('input[data-testid=secret-recovery-phrase-word-input-0]',{
    timeout : 30000
  });

  // PHARSE
  const pharse = recovery_pharse.word.split(" ");
  
  // MASUKAN PHARSE KE INPUTAN
  for (const [indexPharse,valuePharse] of pharse.entries()) {    
    await page.type('input[data-testid=secret-recovery-phrase-word-input-' + indexPharse + ']', valuePharse);

    // await page.$eval('input[data-testid=secret-recovery-phrase-word-input-' + indexPharse + ']', (el,value) => el.value = value,valuePharse);
  }

  // TUNGGU BUTTON IMPORT
  const elementImportWallet = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 30000
  });

  // LALU CLICK
  await elementImportWallet.click();

  // TUNGGU TOMBOL LANJUTKAN
  await delay();

  // CARI TOMBOL LANJTUKAN 
  const elementContinue = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 30000
  });

  // LALU KLIK
  await elementContinue.click();

  // TUNGGU PASSWORD INPUTAN
  await page.waitForSelector('input[data-testid=onboarding-form-password-input]',{
    timeout : 30000
  });

  // MASUKAN INPUTAN PASSWORD
  await page.type('input[data-testid=onboarding-form-password-input]', "12345678910");
  // MASUKAN INPUTAN CONFIRMASI PASSWORD
  await page.type('input[data-testid=onboarding-form-confirm-password-input]', "12345678910");
  // CENTANG TERM OF SERVICE
  await page.$eval('input[data-testid=onboarding-form-terms-of-service-checkbox]', (el) => el.click());

  // TUNGGU TOMBOL KIRIM PASSWORD
  const elementSubmitPassword = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 30000
  });

  // LALU KLIK
  await elementSubmitPassword.click();

  // TUNGGU BEBERAPA DETIK UNTUK PROSES
  await delay();

  // TUNGGU TOMBOL GET STARTED
  const elementGetStarted = await page.waitForSelector('button[data-testid=onboarding-form-submit-button]',{
    timeout : 3000
  });

  // LALU CLICK
  await elementGetStarted.click();

  // PINDAH KE TAB 1
  await newPageList[0].bringToFront();

  // TUNGGU PROSES
  await delay();

  // BUAT TAB BARU
  const lastPage = await browser.newPage();

  // PERGI KE EXTENSION
  await lastPage.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);

  // TUNGGU PROSES SELESAI
  await delay(5000);

  // AMBIL SEMUA TAB
  const newExtensionPageList = await browser.pages();

  const extensionPage = newExtensionPageList[1];

  // SEND TOKEN
    // const sendButtons = await extensionPage.$$("button > span")

    // const textContents = [];

    // for (const el of sendButtons) {
    //   textContents.push(await el.evaluate(el => el.textContent));
    // }

    // console.log(textContents);
  // SEND TOKEN

  // SWAP TOKEN
  const toSwap = await extensionPage.waitForSelector('a[data-testid=bottom-tab-nav-button-swap]',{
    timeout : 30000
  });

  await toSwap.click();

  await delay();

  // BISA BERUBAH
  const cards = await extensionPage.$$("div[class='sc-dRtGhb jUaEpY']")

  await delay();

  await cards[0].click();

  await delay();

  await extensionPage.type("input[placeholder='Search...']","Usdc")
  // Usdc

  const cardSol = await extensionPage.waitForSelector('div[data-testid=fungible-token-row-USDC]',{
    timeout : 30000
  });
  // USDC

  await cardSol.click();

  await delay();

  // BISA BERUBAH
  const maxButton = await extensionPage.waitForSelector("div[class='sc-bXbnwD cdpSQT']",{
    timeout : 30000
  });

  await maxButton.click();

  await delay();

  await cards[1].click();

  await delay();

  await extensionPage.type("input[placeholder='Search...']","Solana")
  // Solana

  const cardUsdc = await extensionPage.waitForSelector('div[data-testid=fungible-token-row-SOL]',{
    timeout : 30000
  });
  // SOL

  await cardUsdc.click();

  // BISA BERUBAH
  const reviewButton = await extensionPage.waitForSelector("button[class='sc-eCImPb fgwvjA']",{
    timeout : 50000
  });

  await reviewButton.click();

  await delay();

  const swapButton = await extensionPage.waitForSelector("button[type=button]",{
    timeout : 50000
  });

  await swapButton.click();


  await delay();

  await extensionPage.waitForSelector("button[type=button]",{
    timeout : 600000
  });

  const textStatus = await extensionPage.waitForSelector("p[size='28']")

  const value = await textStatus.evaluate(el => el.textContent); 

  if(
    value.toLowerCase() === "it's done!" || 
    value.toLowerCase() === "swapping tokens..."
  ){
    console.log('Swap Berhasil :)')
  }else{
    console.log('Swap Gagal :(');
  }

  const closeButtonAgain = await extensionPage.waitForSelector("button[type=button]",{
    timeout : 30000
  });

  closeButtonAgain.click()

  // await delay();

  // const toHOme = await extensionPage.waitForSelector('a[data-testid=bottom-tab-nav-button-swap]',{
  //   timeout : 30000
  // });

  // await toHome.click();
  
  // SWAP TOKEN

  // TUNGGU 5 DETIK UNTUK MENUTUP BROWSER
  // setTimeout(async () => {
  //   for(const closePage of newExtensionPageList){
  //     await closePage.close();
  //   }

  //   await browser.close();
  // },5000);
})();