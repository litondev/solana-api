import { getOrCreateAssociatedTokenAccount, transfer }  from "@solana/spl-token";
import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import bs58 from "bs58";

(async () => {
    // BONK PUBLIC ADDRESS
    const tokenMintAddress = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263')

    const connection = new Connection("https://api.mainnet-beta.solana.com","confirmed");

    const senderWallet = Keypair.fromSecretKey(
        bs58.decode("FROM_ADDRESS_PRIVATE_KEY")
    );

    // TO_ADDRESS
    const receiverPubkey = new PublicKey("61dhHj2YTqTgABE8Pi4R4bz1M8WGbcpmsEfGPdVP9j6m")

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet, 
        tokenMintAddress,
        receiverPubkey 
    );

    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderWallet,
        tokenMintAddress,
        senderWallet.publicKey
    );

    await transfer(
        connection,
        senderWallet,
        senderTokenAccount.address,
        receiverTokenAccount.address,
        senderWallet.publicKey,
        667128 * 100000, 
        // jumlah yang akan ditransfer * jumlah decimal(5 untuk bonk)
    )
})()