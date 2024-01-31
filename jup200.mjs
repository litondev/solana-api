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
        bs58.decode("2dxvbFFN7GKcsXevFsfmUc2siaTBYGXegvV6Eyy5dqPGajwCfMXrqw6FQZ9o6fQKmb3JC2o8LDTH7bQE7iqqVmz1")
    );

    const receiverPubkey = new PublicKey("8HtAyYFDg3UnfBDkXRNhbS2PCdxdz2icQqv3DyHeCUmS")

    console.log("HITUNG DESIMAL");

    let decimal = "1";

    for(let i of Array(parseInt(result.account.data.parsed.info.tokenAmount.decimals)).keys()){
        decimal += "0";
    }

    console.log('MINT RECEIVER');

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet, 
        tokenMintAddress,
        receiverPubkey 
    );

    console.log('MINT SENDER');

    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet,
        tokenMintAddress,
        senderWallet.publicKey
    );

    console.log('KIRIM TOKEN');

    await transfer(
        connection,
        senderWallet,
        senderTokenAccount.address,
        receiverTokenAccount.address,
        senderWallet.publicKey,
        parseFloat(result.account.data.parsed.info.tokenAmount.uiAmount) * parseFloat(decimal)
    )

    console.log("SELESAI")
}

(async () => {
    let wallet_balance = 0.00;
    let tokenFound = null;

    while(true){
        // GET SOL
        console.log("PROSES SOL");

        if(parseFloat(wallet_balance) < 0.002){
            const connection = new Connection("https://api.mainnet-beta.solana.com");

            console.log("REQUEST SOL KE API");

            let balance = await connection.getBalance(new PublicKey("2rtYe69wgYwk5sXpgdakMMc6V1x8httYi2Arfphh4qnH"));

            wallet_balance = parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL);

            console.log('ADA SOL : ' + wallet_balance);
        }else{
            console.log('ADA SOL : ' + wallet_balance);
        }
        // GET SOL 

        // GET TOKEN
        console.log("PROSES TOKEN")
        if(!tokenFound){ 
            console.log("REQUEST JUMLAH TOKEN KE API");

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
            
            console.log('ADA TOKEN : ' + tokenFound);
        }else{
            console.log('ADA TOKEN : ' + tokenFound);
        }
        // GET TOKEN 

        if(
            tokenFound &&
            parseFloat(wallet_balance) >= 0.002
        ){
            console.log("PROSES SEND");

            try{                
                await reSend(tokenFound);
            }catch(e){
                console.log(e);
            }

            break;
        }else{
            console.log('ADA SOL : ' + wallet_balance);

            console.log('ADA TOKEN : ' + tokenFound);
        }

        await delay(4000);
    }
})()