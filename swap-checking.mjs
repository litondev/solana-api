import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import recovery_pharses from './pharses-done.json' assert { type: "json" };

function delay(time = 10000) {
    console.log("------- DELAY PROSES");

    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

for await (const [index,pharse] of recovery_pharses.entries()){
    const connection = new Connection("https://api.mainnet-beta.solana.com");

    console.log("------- AMBIL BALANCE SOL DARI API");

    let balance = await connection.getBalance(new PublicKey(pharse.address));

    console.log("------- BAGI BALANCE SOL DENGAN SATUAN TERKECILNYA");

    let wallet_balance = parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL);

    console.log(`JUMLAH SOL : ` + wallet_balance);

    await delay(5000);
}