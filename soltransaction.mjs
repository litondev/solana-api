import axios from "axios";
import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,createTransferInstruction,getOrCreateAssociatedTokenAccount,createTransferCheckedInstruction,getMint,transferChecked,getAssociatedTokenAddress,createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import bs58 from "bs58";

// https://docs.solana.com/api/http

// https://yihau.github.io/solana-web3-demo/tour/token-transfer.html

(async () => {
    // GET BALANCE
    // const response = await axios({
    //   url: `https://api.mainnet-beta.solana.com`,
    //   method: "post",
    //   headers: { "Content-Type": "application/json" },
    //   data: {
    //     jsonrpc: "2.0",
    //     id: 1,
    //     method: "getBalance",
    //     params: [
    //       "DyRN797hs9QoGnCWKR9LEhdQkbraBVZeWt724CazWnJS"
    //     ],
    //   },
    // });

    // console.log(response.data);
    // GET BALANCE

    // GET TOKEN BY OWNER 
    //  const response = await axios({
    //   url: `https://api.mainnet-beta.solana.com`,
    //   method: "post",
    //   headers: { "Content-Type": "application/json" },
    //   data: {
    //     jsonrpc: "2.0",
    //     id: 1,
    //     method: "getTokenAccountsByOwner",
    //     params: [
    //       "DyRN797hs9QoGnCWKR9LEhdQkbraBVZeWt724CazWnJS",
    //       {
    //         "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
    //       },
    //       {
    //         "encoding": "jsonParsed"
    //       }
    //     ],
    //   },
    // });

    // console.log(response.data.result.value[0].account.data.parsed);
    // GET TOKEN BY OWNER

  // TRANSFER SOL 
    // const connection = new Connection("https://api.mainnet-beta.solana.com");

    // const feePayer = Keypair.fromSecretKey(
    //   bs58.decode("FROM_ADDRESS_PRIVATE_KEY")
    // );

    // const toAddress = Keypair.fromSecretKey(
    //   bs58.decode("TO_ADDRESS_PRIVATE_KEY")
    // );

    // (async () => {
    //   let tx = new Transaction().add(
    //     SystemProgram.transfer({
    //       fromPubkey: feePayer.publicKey,
    //       toPubkey: new PublicKey("61dhHj2YTqTgABE8Pi4R4bz1M8WGbcpmsEfGPdVP9j6m"),
    //       lamports : 19990000
    //       // lamports: 19990000 - 19980000,
    //       // lamports selalu berubah
    //     })
    //   );
    //   tx.feePayer = feePayer.publicKey;

    //   let txhash = await connection.sendTransaction(tx, [feePayer, toAddress]);

    //   console.log(`txhash: ${txhash}`);
    // })();
  // TRANSFER SOL 
})();