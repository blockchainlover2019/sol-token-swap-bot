import * as anchor from "@project-serum/anchor";

import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  // @ts-ignore
  getAssociatedTokenAddress,
  // @ts-ignore
  createAssociatedTokenAccountInstruction,
  // @ts-ignore
  mintTo,
  // @ts-ignore
  createMint,
} from "@solana/spl-token";

// describe("solswap", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.Solswap as Program<Solswap>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

import * as Constants from "./constants";
import { IDL } from "./solswapidl";
import * as keys from "./keys";


const connection = new Connection(clusterApiUrl(Constants.NETWORK));
let secretKey = Uint8Array.from([58,108,149,115,72,122,179,94,20,233,235,182,68,80,24,66,35,241,253,166,84,232,27,92,187,186,131,126,32,212,238,248,50,67,154,113,140,229,53,137,176,233,23,185,77,37,171,151,241,75,152,28,84,94,189,196,200,117,113,72,139,81,89,4]);



export const getProgram = () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  let provider = anchor.getProvider();
  // console.log("provider:", provider);
  //   connection,
  //   wallet,
  //   anchor.Provider.defaultOptions()
  // );
  const program = new anchor.Program(IDL, Constants.PROGRAM_ID, provider);
  // console.log("program:", program);
  return program;

};

export const initializeProgram = async (
  wallet: Keypair
): Promise<string> => {
  if (wallet.publicKey === null) throw new Error();
  const program = getProgram();
  const txHash = await program.methods
    .initialize(
    //   wallet.publicKey,
    //   Constants.TREASURY,
    //   Constants.DEFAULT_TIER_DAYS,
    //   Constants.DEFAULT_TIER_PERCENT,
    //   Constants.DEFAULT_MAX_TIER
    )
    .accounts({
      admin: wallet.publicKey,
      settings: await keys.getSettingsKey(),
      botrole: await keys.getBotRoleKey(),
      pool: await keys.getPoolKey(),
      wsolMint: Constants.SPL_TOKEN_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc();

  if (txHash != null) {
    console.log(
      "Confirming Transaction ..."
    );

    // showToast("Confirming Transaction ...", 10000, 2);
    let res = await connection.confirmTransaction(txHash);
    if (res.value.err) {
      console.log("Trasaction Failed");
      // showToast("Transaction Failed", 2000, 1);
    } else {
      console.log("Trasaction Confirmed");
    }
  } else {
    console.log("Trasaction Failed");
    // showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
};

export const swapToken = async (
  wallet: Keypair
): Promise<any> => {
  if (wallet.publicKey === null) throw new Error();
  const program = getProgram();
  const txHash = await program.methods.swapSolToToken(new anchor.BN(100000000),new anchor.BN(0),new anchor.BN(500), new anchor.BN(100))
    .accounts({
      authority: wallet.publicKey,
      pool: await keys.getPoolKey(),
      botrole: await keys.getBotRoleKey(),
      poolCoinTokenAccount: Constants.poolCoinTokenAccount,
      poolPcTokenAccount: Constants.poolPcTokenAccount,
      uerSourceTokenAccount: Constants.uerSourceTokenAccount,
      uerDestinationTokenAccount: Constants.uerDestinationTokenAccount,
      wsolMint: Constants.wsolMint,
      outMint: Constants.outMint,
      ammId: Constants.ammId,
      ammAuthority: Constants.ammAuthority,
      ammOpenOrders: Constants.ammOpenOrders,
      ammTargetOrders: Constants.ammTargetOrders,
      serumProgram: Constants.serumProgram,
      serumMarket:Constants.serumMarket,
      serumBids: Constants.serumBids,
      serumAsks: Constants.serumAsks,
      serumEventQueue: Constants.serumEventQueue,
      serumCoinVault: Constants.serumCoinVault,
      serumPcVault: Constants.serumPcVault,
      serumVaultSigner: Constants.serumVaultSigner,
      raydiumAmmProgram: Constants.raydiumAmmProgram,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

  if (txHash != null) {
    console.log(
      "Confirming Transaction ..."
    );

    // showToast("Confirming Transaction ...", 10000, 2);
    let res = await connection.confirmTransaction(txHash);
    if (res.value.err) {
      console.log("Trasaction Failed");
      // showToast("Transaction Failed", 2000, 1);
    } else {
      console.log("Trasaction Confirmed");
    }
  } else {
    console.log("Trasaction Failed");
    // showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
};


describe("solswap", () => {
  it("Is initialized!", async () => {
    // let wallet = Keypair.fromSecretKey(secretKey);
    // const res = await initializeProgram(wallet);
    // console.log("hxhash:", res);
  });

  it("token swap!", async () => {
    let wallet = Keypair.fromSecretKey(secretKey);
    const res = await swapToken(wallet);
    console.log("hxhash:", res);
  });

});
