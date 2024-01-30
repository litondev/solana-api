import { getOrCreateAssociatedTokenAccount, transfer }  from "@solana/spl-token";
import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";

function delay(time = 3000) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

async function reSend(result){
    const tokenMintAddress = new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN')

    const connection = new Connection("https://api.mainnet-beta.solana.com",{
        commitment: "confirmed",
    });
           
    const senderWallet = Keypair.fromSecretKey(
        bs58.decode("eysRKuoJFhRBGzM4SLBxTWaYVAEbpFc9Te5tVxwpUeCz8BSsLm4oMCBBf5CT8vJ8mwVKcXgVxowuEwawbTMGinM")
    );

    const receiverPubkey = new PublicKey("8HtAyYFDg3UnfBDkXRNhbS2PCdxdz2icQqv3DyHeCUmS")

    let decimal = "1";

    for(let i of Array(parseInt(result.account.data.parsed.info.tokenAmount.decimals)).keys()){
        decimal += "0";
    }

    console.log('Mint Receiver');

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet, 
        tokenMintAddress,
        receiverPubkey 
    );

    console.log('Mint Sender');

    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet,
        tokenMintAddress,
        senderWallet.publicKey
    );

    console.log('Kirim Token');

    await transfer(
        connection,
        senderWallet,
        senderTokenAccount.address,
        receiverTokenAccount.address,
        senderWallet.publicKey,
        parseFloat(result.account.data.parsed.info.tokenAmount.uiAmount) * parseFloat(decimal)
    )
}

(async () => {
    let isThirdRequest = false;
    let countRequest = 1;
    let wallet_balance = 0.00;
    let tokenFound = null;

    while(true){
        if(countRequest === 2){
            isThirdRequest = true;
        }else{
            countRequest += 1;
        }
        
        // GET SOL
        if(parseFloat(wallet_balance) < 0.002){
            const connection = new Connection("https://api.mainnet-beta.solana.com");

            let balance = await connection.getBalance(new PublicKey("2rtYe69wgYwk5sXpgdakMMc6V1x8httYi2Arfphh4qnH"));

            wallet_balance = parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL);

            console.log('Request Sol');
        }else{
            console.log('Ada Sol');
        }
        // GET SOL 

        // GET TOKEN
        if(!tokenFound){ 
            const response = await axios({
                url: `https://api.mainnet-beta.solana.com`,
                method: "post",
                headers: { "Content-Type": "application/json" },
                data: {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getTokenAccountsByOwner",
                    params: [
                        "2rtYe69wgYwk5sXpgdakMMc6V1x8httYi2Arfphh4qnH",
                        {
                            // JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN JUP
                            // CONTOH DUMY
                            "mint": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
                        },
                        {
                            "encoding": "jsonParsed"
                        }
                    ],
                },
            });

            if(response.data.result.value.length){
                tokenFound = response.data.result.value[0];
            }
            
            console.log('Request Token');
        }else{
            console.log('Ada Token');
        }
        // GET TOKEN 

        if(
            tokenFound &&
            parseFloat(wallet_balance) >= 0.002
        ){
            try{
                await reSend(tokenFound);
            }catch(e){
                console.log(e);
            }

            break;
        }else{
            console.log('balance : ' + wallet_balance);

            //   console.log('data : ');

            //   console.log(response.data.result.value);
        }

        if(isThirdRequest){
            await delay(4000);

            isThirdRequest = false;

            countRequest = 0;
        }else{
            await delay(4000);
        }
    }
})()