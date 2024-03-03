import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import recovery_pharses from './pharses1-done.json' assert { type: "json" };

function delay(time = 10000) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

for await (const [index,pharse] of recovery_pharses.entries()){
    const connection = new Connection("https://api.mainnet-beta.solana.com");

    let balance = await connection.getBalance(new PublicKey(pharse.address));

    let wallet_balance = parseFloat(balance) / parseFloat(LAMPORTS_PER_SOL);

    console.log(`JUMLAH SOL : ` + wallet_balance + ' (' + (index + 1) + ')');

    await delay(5000);
}