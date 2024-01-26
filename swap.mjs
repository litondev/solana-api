import axios from "axios";
import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,createTransferInstruction,getOrCreateAssociatedTokenAccount,createTransferCheckedInstruction,getMint,transferChecked,getAssociatedTokenAddress,createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import bs58 from "bs58";
import puppeteer from 'puppeteer';


import recovery_pharses from './pharses.json' assert { type: "json" };

function delay(time = 3000) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

async function onSwap({extensionPage,swapToTitle,swapToName,swapFromTitle,swapFromName}){
    const toSwap = await extensionPage
        .waitForSelector('a[data-testid=bottom-tab-nav-button-swap]',{
            timeout : 30000
        });

    await toSwap.click();

    await delay();

    // BISA BERUBAH
    const cards = await extensionPage
    .$$("div[class='sc-dRtGhb jUaEpY']")

    await delay();

    await cards[0].click();

    await delay();

    await extensionPage.type("input[placeholder='Search...']",swapFromTitle)
    // Solana

    const cardFrom = await extensionPage
    .waitForSelector('div[data-testid=fungible-token-row-' + swapFromName +']',{
        timeout : 30000
    });
    // SOL

    await cardFrom.click();

    await delay();

    // BISA BERUBAH
    const maxButton = await extensionPage
    .waitForSelector("div[class='sc-bXbnwD cdpSQT']",{
        timeout : 30000
    });

    await maxButton.click();

    await delay();

    await cards[1].click();

    await delay();

    await extensionPage.type("input[placeholder='Search...']",swapToTitle)
    // Usdc

    const cardTo = await extensionPage
    .waitForSelector('div[data-testid=fungible-token-row-'+swapToName+']',{
        timeout : 30000
    });
    // USDC

    await cardTo.click();

    // BISA BERUBAH
    const reviewButton = await extensionPage
    .waitForSelector("button[class='sc-eCImPb fgwvjA']",{
        timeout : 50000
    });

    await reviewButton.click();

    await delay();

    const swapButton = await extensionPage
    .waitForSelector("button[type=button]",{
        timeout : 50000
    });

    await swapButton.click();

    await delay();

    await extensionPage
    .waitForSelector("button[type=button]",{
        timeout : 600000
    });

    const textStatus = await extensionPage
    .waitForSelector("p[size='28']")

    const value = await textStatus.evaluate(el => el.textContent); 

    if(
        value.toLowerCase() === "it's done!" || 
        value.toLowerCase() === "swapping tokens..."
    ){
        console.log('Swap Berhasil :)')
    }else{
        console.log('Swap Gagal :(');

        throw new Error("Swap Pertama Gagal");
    }

    const closeButtonAgain = await extensionPage
    .waitForSelector("button[type=button]",{
        timeout : 30000
    });

    closeButtonAgain.click()
}

for await (const [index,pharse] of recovery_pharses.entries()){
    try{
        console.log(pharse);

        // console.log('swap');
        // SWAP SOL
            const EXTENSION_PATH = 'C:\\Users\\ACER\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\bfnaelmomeimhlpmgjnjophhpkkoljpa\\23.19.0_0'
            const EXTENSION_ID = 'bfnaelmomeimhlpmgjnjophhpkkoljpa';

            const browser = await puppeteer.launch({
                headless : false,
                args: [
                    `--disable-extensions-except=${EXTENSION_PATH}`,
                    `--load-extension=${EXTENSION_PATH}`,
                    "--no-sandbox",
                ]
            });

            await delay();

            const newPageList = await browser.pages();

            const page = newPageList[1];

            await page.bringToFront();

            await delay();

            const elementImportRecoveryPharseButton = await page
            .waitForSelector('button[data-testid=import-recovery-phrase-button]',{
                timeout : 30000
            });

            await elementImportRecoveryPharseButton.click();

            await page
            .waitForSelector('input[data-testid=secret-recovery-phrase-word-input-0]',{
                timeout : 30000
            });

            const pharse_word = pharse.word.split(" ");
            
            for (const [indexPharse,valuePharse] of pharse_word.entries()) {    
                await page
                    .type('input[data-testid=secret-recovery-phrase-word-input-' + indexPharse + ']', valuePharse);
            }

            const elementImportWallet = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 30000
            });

            await elementImportWallet.click();

            await delay();

            const elementContinue = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 30000
            });

            await elementContinue.click();

            await page
            .waitForSelector('input[data-testid=onboarding-form-password-input]',{
                timeout : 30000
            });

            await page
            .type('input[data-testid=onboarding-form-password-input]', "12345678910");

            await page
            .type('input[data-testid=onboarding-form-confirm-password-input]', "12345678910");

            await page
            .$eval('input[data-testid=onboarding-form-terms-of-service-checkbox]', (el) => el.click());

            const elementSubmitPassword = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 30000
            });

            await elementSubmitPassword.click();

            await delay();

            const elementGetStarted = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 3000
            });

            await elementGetStarted.click();

            await newPageList[0].bringToFront();

            await delay();

            const lastPage = await browser.newPage();

            await lastPage.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);

            await delay(5000);

            const newExtensionPageList = await browser.pages();

            const extensionPage = newExtensionPageList[1];

            // FIRST
                onSwap({
                    extensionPage : extensionPage,
                    swapFromTitle : 'Solana',
                    swapFromName : 'SOL',
                    swapToTitle : 'Usdc',
                    swapToName : 'USDC'
                })
            // FIRST

            await delay();

            // SECOND
                onSwap({
                    extensionPage : extensionPage,
                    swapFromTitle : 'Usdc',
                    swapFromName : 'USDC',
                    swapToTitle : 'Solana',
                    swapToName : 'SOL'
                })
            // SECOND

            await delay();

            // CLOSE
                // for(const closePage of newExtensionPageList){
                //     await closePage.close();
                // }

                // await browser.close();
            // CLOSE

            // await delay(15000);
        // SWAP SOL

        // if(index !== (recovery_pharses.length - 1)){
            // console.log('transfer');

            // const connection = new Connection("https://api.mainnet-beta.solana.com");

            // GET BALANCE
                // let balance = await connection.getBalance(new PublicKey(pharse.address));

                // console.log(`Wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
            
                // console.log('Transfer Amount : ' + parseFloat((parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL)).toFixed(1)));
            // GET BALANCE

            // TRANSFER SOL 

            // let feePayer = null;

            // try{
            //     const convertKey = new Uint8Array(JSON.parse(pharse.key));

            //     feePayer = Keypair.fromSecretKey(
            //         bs58.decode(bs58.encode(convertKey))    
            //     );
            // }catch(err){    
            //     feePayer = Keypair.fromSecretKey(
            //         bs58.decode(pharse.key)   
            //     );
            // }

            // (async () => {
            //     let tx = new Transaction().add(
            //     SystemProgram.transfer({
            //         fromPubkey: feePayer.publicKey,
            //         toPubkey: new PublicKey(recovery_pharses[index + 1].address),
            //         lamports : parseFloat((parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL)).toFixed(1)) * parseFloat(LAMPORTS_PER_SOL)
            //     })
            //     );
            //     tx.feePayer = feePayer.publicKey;
        
            //     let txhash = await connection.sendTransaction(tx, [feePayer]);
        
            //     console.log(`txhash: ${txhash}`);
            // })();
            // TRANSFER SOL 
        // }

        // console.log("=========================")

        // await delay(15000);
    }catch(err){
        console.log(pharse);

        console.log(err);

        break;
    }
}