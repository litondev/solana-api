import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";
import puppeteer from 'puppeteer';

// FIRST 68 usd
// AKHIR 50 usd
// TOTAL 68 - 50 => 18 usd / 10 wallet (PERCOBAAN)

// FRIST 25 usd
// AKHIR 22 usd
// TOTAL 25 - 22 => 3 usd / 10 wallet (UJI TERAKHIR)

// AWAL PASTI HARUS KROBAN 0.002 SOL UTK WALLET KOSONG

// SEMISAL ERROR TERUS NAIKIN DELAYNYA BIASANYA  

import recovery_pharses from './pharses1.json' assert { type: "json" };

function delay(time = 10000) {
    console.log("------- DELAY PROSES");

    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

async function onSwap({extensionPage,swapToTitle,swapToName,swapFromTitle,swapFromName,pharse = null,failed = 0}){
    console.log("------- CARI BUTTON MENU SWAP");

    const toSwap = await extensionPage
        .waitForSelector('a[data-testid=bottom-tab-nav-button-swap]',{
            timeout : 30000
        });

    console.log("------- KLIK BUTTON");

    await toSwap.click();

    await delay();

    console.log("------- CARI CARD SWAP DARI")
    const cards = await extensionPage
    .$$("div[class='sc-cjVSuP jDekLu']")
    // BISA BERUBAH CARD 

    await delay();

    console.log("------- KLIK CARD DARI");

    await cards[0].click();

    await delay();

    console.log("------- MASUKAN TOKEN DARI");

    await extensionPage.type("input[placeholder='Search...']",swapFromTitle)

    console.log("------- CARI CARD TOKEN DARI");
    const cardFrom = await extensionPage
    .waitForSelector('div[data-testid=fungible-token-row-' + swapFromName +']',{
        timeout : 30000
    });

    console.log("------- KLIK CARD TOKEN");

    await cardFrom.click();

    await delay();

    if(
        swapFromName === 'SOL' && 
        pharse
    ){
        const connection = new Connection("https://api.mainnet-beta.solana.com");

        console.log("------- AMBIL SOL BALANCE");

        let balance = await connection.getBalance(new PublicKey(pharse.address));
        
        console.log("------- PERHITUNGAN SOL YANG DI SWAP");

        let swap_amount =  parseFloat((parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL)).toFixed(2));

        swap_amount -= 0.1

        swap_amount = parseFloat(swap_amount.toFixed(2))

        console.log("------- SOL SWAP : " + swap_amount);

        console.log("------- ISI JUMLAH");

        await extensionPage
            .type('input[name=amount]', swap_amount.toString());
    }else{
        console.log("------- CARI MAX BUTTON");

        const maxButton = await extensionPage
        .waitForSelector("div[class='sc-gkXSjM biuPGG']",{
            timeout : 30000
        });
        // BISA BERUBAH MAX BUTTON

        console.log("------- KLIK BUTTON");

        await maxButton.click();
    }

    await delay();

    console.log("------- KLIK CARD KE");

    await cards[1].click();

    await delay();

    console.log("------- MASUKAN TOKEN KE");
    await extensionPage.type("input[placeholder='Search...']",swapToTitle)

    console.log("------- CARI TOKEN KE");
    const cardTo = await extensionPage
    .waitForSelector('div[data-testid=fungible-token-row-' + swapToName + ']',{
        timeout : 30000
    });

    console.log("------- KLIK TOKEN");
    await cardTo.click();

    console.log("------- CARI REVIEW BUTTON");

    const reviewButton = await extensionPage
    .waitForSelector("button[class='sc-eCImPb fgwvjA']",{
        timeout : 50000
    });
    // BISA BERUBAH REVIEW BUTTON

    console.log("------- KLIK BUTTON");

    await reviewButton.click();

    await delay();

    console.log("------- CARI SWAP BUTTON");
    const swapButton = await extensionPage
    .waitForSelector("button[type=button]",{
        timeout : 50000
    });

    console.log("------- KLIK BUTTON");
    await swapButton.click();

    await delay();

    console.log("------- CARI BUTTON CLOSE");

    await extensionPage
    .waitForSelector("button[type=button]",{
        timeout : 600000
    });

    console.log("------- CARI TEXT");
    const textStatus = await extensionPage
    .waitForSelector("p[size='28']")

    console.log("------- AMBIL TEXT");
    const value = await textStatus.evaluate(el => el.textContent); 

    let swapFailed = false;

    if(
        value.toLowerCase() === "it's done!" || 
        value.toLowerCase() === "swapping tokens..."
    ){
        console.log('SWAP BERHASIL ' + swapFromTitle + ' -> ' + swapToTitle + ' :)')
    }else{
        console.log('SWAP GAGAL ' + swapFromTitle + ' -> ' + swapToTitle + ' :(')

        swapFailed = true;
    }

    console.log("------- CARI BUTTON CLOSE");
    const closeButtonAgain = await extensionPage
    .waitForSelector("button[type=button]",{
        timeout : 30000
    });

    console.log("------- KLIK BUTTON");
    await closeButtonAgain.click()

    if(swapFailed){
        await delay();

        console.log("SWAP GAGAL " + swapFromTitle + " -> " + swapToTitle + " AKAN MENCOBA LAGI KE " + (failed + 1));

        if(failed >= 3){
            throw new Error("SWAP GAGAL SUDAH MENCOBA 3 KALI");
        }else{
            failed += 1;

            console.log("------- CARI BUTTON MENU HOME");

            const toHome = await extensionPage
                .waitForSelector('a[aria-label=Home]',{
                    timeout : 30000
                });

            console.log("------- KLIK BUTTON");

            await toHome.click();

            await delay(5000);
            
            await onSwap({
                extensionPage,
                swapToTitle,
                swapToName,
                swapFromTitle,
                swapFromName,
                pharse,
                failed
            })
        }
    }
}

for await (const [index,pharse] of recovery_pharses.entries()){
    let browser = null;

    try{
        console.log({
            // ...pharse,
            address : pharse.address,
            index : (index + 1)
        });

        console.log('PROSES SWAP');

        // SWAP SOL
            const EXTENSION_PATH = 'C:\\Users\\ACER\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\bfnaelmomeimhlpmgjnjophhpkkoljpa\\24.0.1_0'
            const EXTENSION_ID = 'bfnaelmomeimhlpmgjnjophhpkkoljpa';

            console.log("------- INISIAL BROWSER");

            browser = await puppeteer.launch({
                headless : false,
                args: [
                    `--disable-extensions-except=${EXTENSION_PATH}`,
                    `--load-extension=${EXTENSION_PATH}`,
                    "--no-sandbox",
                ]
            });

            await delay();

            console.log("------- AMBIL HALAMAN");

            const newPageList = await browser.pages();

            console.log("------- AMBIL HALAMAN KE 2");

            const page = newPageList[1];
            
            console.log("------- TAMPILKAN HALAMAN KE 2");

            await page.bringToFront();

            await delay();

            console.log("------- AMBIL BUTTON IMPORT");
            
            const elementImportRecoveryPharseButton = await page
            .waitForSelector('button[data-testid=import-recovery-phrase-button]',{
                timeout : 30000
            });

            console.log("------- KLIK BUTTON");

            await elementImportRecoveryPharseButton.click();

            console.log("------- CARI INPUTAN PHARSE");

            await page
            .waitForSelector('input[data-testid=secret-recovery-phrase-word-input-0]',{
                timeout : 30000
            });

            console.log("------- SPLIT PHARSE");

            const pharse_word = pharse.word.split(" ");
            
            console.log("------- LAKUKAN PERULANGAN PHARSE");

            for (const [indexPharse,valuePharse] of pharse_word.entries()) {    
                console.log("------- MASUKAN PHARSE KE " + (indexPharse + 1));

                await page
                    .type('input[data-testid=secret-recovery-phrase-word-input-' + indexPharse + ']', valuePharse);
            }

            console.log("------- CARI BUTTON KIRIM");

            const elementImportWallet = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 30000
            });

            console.log("------- KLIK BUTTON");

            await elementImportWallet.click();

            await delay();

            console.log("------- CARI BUTTON CONTINUE");

            const elementContinue = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 30000
            });

            console.log("------- KLIK BUTTON");

            await elementContinue.click();

            console.log("------- CARI INPUTAN PASSWORD");

            await page
            .waitForSelector('input[data-testid=onboarding-form-password-input]',{
                timeout : 30000
            });

            console.log("------- MASUKAN PASSWORD");

            await page
            .type('input[data-testid=onboarding-form-password-input]', "12345678910");

            console.log("------- MASUKAN PASSWORD KONFRIMASI");

            await page
            .type('input[data-testid=onboarding-form-confirm-password-input]', "12345678910");

            console.log("------- CENTANG TERM OF SERVICE");

            await page
            .$eval('input[data-testid=onboarding-form-terms-of-service-checkbox]', (el) => el.click());

            console.log("------- CARTI BUTTON KIRIM");

            const elementSubmitPassword = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 30000
            });

            console.log("------- KLIK BUTTON")
            await elementSubmitPassword.click();

            await delay();

            console.log("------- CARI BUTTON GET STARTED");

            const elementGetStarted = await page
            .waitForSelector('button[data-testid=onboarding-form-submit-button]',{
                timeout : 3000
            });

            console.log("------- PERGI KE HALAMAN 1 ");

            await newPageList[0].bringToFront();

            console.log("------- TUTUP HALAMAN KE 2");

            await newPageList[1].close();

            await delay();

            console.log("------- BUAT HALAMAN BARU");

            const lastPage = await browser.newPage();

            console.log("------- PANGGIL EXTENSION PHANTOM");

            await lastPage.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);

            await delay(5000);

            console.log("------- AMBIIL SEMUA HALAMAN");
            
            const newExtensionPageList = await browser.pages();

            console.log("------- AMBIL HALAMAN KE 2");

            const extensionPage = newExtensionPageList[1];

            // PYTH -> Pyth 
            // SAROS -> Saros
            // JITO -> Jito
            // USDC -> Usdc

            // FLUXBOT
            // JLP
            // JUP 
            // MARINDE 
            // ACCESS PROTOCOL 

            // FIRS
                let swapFromTitle = 'Solana';
                let swapFromName = 'SOL';
                let swapToTitle = 'Pyth';
                let swapToName = 'PYTH';

                // if(index !== 0){
                    console.log("PROSES SWAP " + swapFromTitle + " -> " + swapToTitle);

                    await onSwap({
                        extensionPage : extensionPage,
                        swapFromTitle : swapFromTitle,
                        swapFromName : swapFromName,
                        swapToTitle : swapToTitle,
                        swapToName : swapToName,
                        pharse
                    })
                // }
                
            // FIRST

            await delay(10000);

            // SECOND
                console.log("PROSES SWAP " + swapToTitle + " -> " + swapFromTitle);

                await onSwap({
                    extensionPage : extensionPage,
                    swapFromTitle : swapToTitle,
                    swapFromName : swapToName,
                    swapToTitle : swapFromTitle,
                    swapToName : swapFromName
                })
            // SECOND

            await delay(30000);

            // CLOSE
                console.log("------- TUTUP SEMUA HALAMAN");
                for(const closePage of newExtensionPageList){
                    await closePage.close();
                }

                console.log("------- TUTUP BROWSER")
                await browser.close();
            // CLOSE

            await delay(10000);
        // SWAP SOL

        console.log('PROSES TRANSFER');
        // TRANSFER SOL 
        if(index !== (recovery_pharses.length - 1)){
            const connection = new Connection("https://api.mainnet-beta.solana.com");

            console.log("------- AMBIL BALANCE SOL DARI API");

            let balance = await connection.getBalance(new PublicKey(pharse.address));

            console.log("------- BAGI BALANCE SOL DENGAN SATUAN TERKECILNYA");

            let wallet_balance = parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL);

            console.log(`JUMLAH SOL : ` + wallet_balance);
            
            console.log("------- PERHITUNGAN JUMLAH TRANSFER");

            let transfer_amount =  parseFloat((parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL)).toFixed(3));
            
            if(
                parseFloat(wallet_balance) < parseFloat(transfer_amount) || 
                parseFloat(wallet_balance.toFixed(3)) === parseFloat(transfer_amount)
            ){
                let transfer_decrease = [0.001,0.002,0.003,0.004,0.005,0.006,0.007,0.008,0.009];

                let isFindDecrease = false;

                for(let decrase of transfer_decrease.entries()){
                    let temp_transfer_amount = transfer_amount;

                    temp_transfer_amount -= decrase;

                    let left_amount = parseFloat(wallet_balance) - parseFloat(temp_transfer_amount);

                    if(
                        left_amount < 0.003 && 
                        left_amount > 0.002 &&
                        !isFindDecrease 
                    ){
                        transfer_amount -= decrase;

                        isFindDecrease = true;
                    }
                }

                if(!isFindDecrease){
                    transfer_amount -= 0.002
                }

                transfer_amount = parseFloat(transfer_amount.toFixed(3))
            }

            console.log('JUMLAH TRANSFER : ' + transfer_amount);
        
            if(parseFloat(transfer_amount) === 0.00){
                throw new Error("TRANSFER SOL GAGAL JUMLAH 0.00");
            }

            console.log("------- AMBIL PRIVATE KEY");

            let feePayer = null;

            try{
                const convertKey = new Uint8Array(JSON.parse(pharse.key));

                feePayer = Keypair.fromSecretKey(
                    bs58.decode(bs58.encode(convertKey))    
                );
            }catch(err){    
                feePayer = Keypair.fromSecretKey(
                    bs58.decode(pharse.key)   
                );
            }

            console.log("LAKUKAN TRANSFER");

            let tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: feePayer.publicKey,
                    toPubkey: new PublicKey(recovery_pharses[index + 1].address),
                    lamports : transfer_amount * parseFloat(LAMPORTS_PER_SOL)
                })
            );

            tx.feePayer = feePayer.publicKey;
    
            let txhash = await connection.sendTransaction(tx, [feePayer]);
    
            console.log(`TXHASH: ${txhash}`);

            await delay(30000);
        }
        // TRANSFER SOL 
    }catch(err){
        console.log(err);

        if(browser){
            console.log("------- TUTUP BROWSER");

            // await browser.close();
        }

        break;
    }
}
