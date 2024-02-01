import { getOrCreateAssociatedTokenAccount, transfer }  from "@solana/spl-token";
import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";

function delay(time = 3000) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

(async () => {
    let data = null;
    while(true){
        try{
            const tokenMintAddress = new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN')
        
            const connection = new Connection("https://api.mainnet-beta.solana.com",{
                commitment: "confirmed",
            });
                   
            const senderWallet = Keypair.fromSecretKey(
                bs58.decode("2dxvbFFN7GKcsXevFsfmUc2siaTBYGXegvV6Eyy5dqPGajwCfMXrqw6FQZ9o6fQKmb3JC2o8LDTH7bQE7iqqVmz1")
            );
        
            const receiverPubkey = new PublicKey("8HtAyYFDg3UnfBDkXRNhbS2PCdxdz2icQqv3DyHeCUmS")
        
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
                200 * 1000000
            )
        
            console.log("SELESAI")
        }catch(e){
            console.log(e);

            await delay();
        }
    }
})()