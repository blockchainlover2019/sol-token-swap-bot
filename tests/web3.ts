import {
    Keypair,
    Commitment,
    Connection,
    RpcResponseAndContext,
    SignatureStatus,
    SimulatedTransactionResponse,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
    Blockhash,
    FeeCalculator,
  } from "@solana/web3.js";
  import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
  
  // import { showToast } from "./utils";
  // import { toast } from "react-toastify";
  
  interface BlockhashAndFeeCalculator {
    blockhash: Blockhash;
    feeCalculator: FeeCalculator;
  }
  const PACKET_DATA_SIZE = 1280 - 40 - 8;
  
  export const getErrorForTransaction = async (
    connection: Connection,
    txid: string
  ) => {
    // wait for all confirmation before geting transaction
    await connection.confirmTransaction(txid, "max");
  
    const tx = await connection.getParsedConfirmedTransaction(txid);
  
    const errors: string[] = [];
    if (tx?.meta && tx.meta.logMessages) {
      tx.meta.logMessages.forEach((log) => {
        const regex = /Error: (.*)/gm;
        let m;
        while ((m = regex.exec(log)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
  
          if (m.length > 1) {
            errors.push(m[1]);
          }
        }
      });
    }
  
    return errors;
  };
  
  export enum SequenceType {
    Sequential,
    Parallel,
    StopOnFailure,
  }
  
  export const sendTransactions = async (
    connection: Connection,
    wallet: any,
    instructionSet: TransactionInstruction[][],
    signers: Keypair[],
    sequenceType: SequenceType = SequenceType.Parallel,
    commitment: Commitment = "singleGossip",
    progressCallback: (ind: number) => void = (ind) => {},
    successCallback: (txid: string, ind: number) => void = (txid, ind) => {},
    failCallback: (reason: string, ind: number) => boolean = (txid, ind) => false,
    block?: BlockhashAndFeeCalculator
  ): Promise<{ number: number; txs: { txid: string; slot: number }[] }> => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
  
    console.log("sendTransactions");
  
    const unsignedTxns: Transaction[] = [];
  
    if (!block) {
      block = await connection.getRecentBlockhash(commitment);
    }
  
    for (let i = 0; i < instructionSet.length; i++) {
      const instructions = instructionSet[i];
  
      if (instructions.length === 0) {
        continue;
      }
  
      let transaction = new Transaction();
      instructions.forEach((instruction) => transaction.add(instruction));
      transaction.recentBlockhash = block.blockhash;
      transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      );
  
      if (signers.length > 0) {
        transaction.partialSign(...signers);
      }
  
      unsignedTxns.push(transaction);
    }
  
    const signedTxns = await wallet.signAllTransactions(unsignedTxns);
    let txIds: any = [];
    if (signedTxns.length > 0) {
      if (signedTxns.length == 1) {
        // let confirming_id = showToast("Confirming Transaction ...", -1, 2);
        let txId = await sendSignedTransaction(connection, signedTxns[0]);
        txIds.push(txId);
  
        let res = await connection.confirmTransaction(txId, "confirmed");
        // toast.dismiss(confirming_id);
        // if (res.value.err) showToast(`Transaction Failed`, 2000, 1);
        // else showToast(`Transaction Confirmed`, 2000)
      } else {
        // let confirming_id = showToast(`Confirming Transaction 1 of ${signedTxns.length}...`, -1, 2);
        for (let i = 0; i < signedTxns.length; i++) {
          console.log("waiting", i);
          let txId = await sendSignedTransaction(connection, signedTxns[i]);
          txIds.push(txId);
  
          let res = await connection.confirmTransaction(txId, "confirmed");
          // if (res.value.err) showToast(`Transaction Failed`, 2000, 1);
          // else showToast(`Transaction Confirmed`, 2000)
  
          // if ( i + 2 <= signedTxns.length)
          //   toast.update(confirming_id, { render: `Confirming Transaction ${i+2} of ${signedTxns.length}...`});
          // else toast.dismiss(confirming_id);
        }
      }
    }
    return { number: signedTxns.length, txs: txIds };
  };
  
  export const sendTransaction = async (
    connection: Connection,
    wallet: any,
    instructions: TransactionInstruction[],
    signers: Keypair[],
    awaitConfirmation = true,
    commitment: Commitment = "singleGossip",
    includesFeePayer: boolean = false,
    block?: BlockhashAndFeeCalculator
  ) => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
  
    let transaction = new Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (
      block || (await connection.getRecentBlockhash(commitment))
    ).blockhash;
  
    if (includesFeePayer) {
      transaction.setSigners(...signers.map((s) => s.publicKey));
    } else {
      transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      );
    }
  
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
      transaction = await wallet.signTransaction(transaction);
    }
  
    const rawTransaction = transaction.serialize();
    let options = {
      skipPreflight: true,
      commitment,
    };
  
    const txid = await connection.sendRawTransaction(rawTransaction, options);
    let slot = 0;
  
    if (awaitConfirmation) {
      const confirmation = await awaitTransactionSignatureConfirmation(
        txid,
        DEFAULT_TIMEOUT,
        connection,
        commitment
      );
  
      if (!confirmation)
        throw new Error("Timed out awaiting confirmation on transaction");
      slot = confirmation?.slot || 0;
  
      if (confirmation?.err) {
        const errors = await getErrorForTransaction(connection, txid);
  
        console.log(errors);
        throw new Error(`Raw transaction ${txid} failed`);
      }
    }
  
    return { txid, slot };
  };
  
  export const sendTransactionWithRetry = async (
    connection: Connection,
    wallet: any,
    instructions: TransactionInstruction[],
    signers: Keypair[],
    commitment: Commitment = "singleGossip",
    includesFeePayer: boolean = false,
    block?: BlockhashAndFeeCalculator,
    beforeSend?: () => void
  ) => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
  
    let transaction = new Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (
      block || (await connection.getRecentBlockhash(commitment))
    ).blockhash;
  
    if (includesFeePayer) {
      transaction.setSigners(...signers.map((s) => s.publicKey));
    } else {
      transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      );
    }
  
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
      transaction = await wallet.signTransaction(transaction);
    }
  
    if (beforeSend) {
      beforeSend();
    }
  
    const txid = await sendSignedTransaction(connection, transaction);
  
    return { txid };
  };
  
  export const getUnixTs = () => {
    return new Date().getTime() / 1000;
  };
  
  const DEFAULT_TIMEOUT = 60000;
  
  async function awaitTransactionSignatureConfirmation(
    txid: TransactionSignature,
    timeout: number,
    connection: Connection,
    commitment: Commitment = "recent",
    queryStatus = false
  ): Promise<SignatureStatus | null | void> {
    let done = false;
    let status: SignatureStatus | null | void = {
      slot: 0,
      confirmations: 0,
      err: null,
    };
    let subId = 0;
    status = await new Promise(async (resolve, reject) => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        console.log("Rejecting for timeout...");
        reject({ timeout: true });
      }, timeout);
      try {
        subId = connection.onSignature(
          txid,
          (result, context) => {
            done = true;
            status = {
              err: result.err,
              slot: context.slot,
              confirmations: 0,
            };
            if (result.err) {
              console.log("Rejected via websocket", result.err);
              reject(status);
            } else {
              console.log("Resolved via websocket", result);
              resolve(status);
            }
          },
          commitment
        );
      } catch (e) {
        done = true;
        console.error("WS error in setup", txid, e);
      }
      while (!done && queryStatus) {
        // eslint-disable-next-line no-loop-func
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ]);
            status = signatureStatuses && signatureStatuses.value[0];
            if (!done) {
              if (!status) {
                console.log("REST null result for", txid, status);
              } else if (status.err) {
                console.log("REST error for", txid, status);
                done = true;
                reject(status.err);
              } else if (!status.confirmations) {
                console.log("REST no confirmations for", txid, status);
              } else {
                console.log("REST confirmation for", txid, status);
                done = true;
                resolve(status);
              }
            }
          } catch (e) {
            if (!done) {
              console.log("REST connection error: txid", txid, e);
            }
          }
        })();
        await sleep(2000);
      }
    });
  
    //@ts-ignore
    if (connection._signatureSubscriptions[subId])
      connection.removeSignatureListener(subId);
    done = true;
    return status;
  }
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export async function getMultipleTransactions(
    connection: Connection,
    wallet: any,
    instructions: TransactionInstruction[] = [],
    signers: any = []
  ) {
    const recentBlockhash = (await connection.getRecentBlockhash("processed"))
      .blockhash;
    const instructionSet = splitTransaction(
      wallet,
      instructions,
      signers,
      recentBlockhash
    );
    console.log("instructionSet =", instructionSet);
    return instructionSet;
  }
  export async function sendMultiTransactions(
    connection: Connection,
    wallet: any,
    instructionSet: TransactionInstruction[][],
    signers: any = []
  ) {
    console.log("sendMultiTransactions");
    let { txs } = await sendTransactions(
      connection,
      wallet,
      instructionSet,
      signers,
      SequenceType.Sequential,
      "single"
    );
    return txs;
  }
  export async function sendSignedTransaction(
    connection: Connection,
    signedTransaction: Transaction
  ): Promise<string> {
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    const rawTransaction = signedTransaction.serialize();
  
    let maxTry = 10;
    let real_txid = "";
  
    while (maxTry > 0 && real_txid == "") {
      maxTry--;
      const txid: TransactionSignature = await connection.sendRawTransaction(
        rawTransaction,
        {
          skipPreflight: true,
          preflightCommitment: "confirmed",
        }
      );
      let softTry = 3;
      while (softTry > 0) {
        softTry--;
        await delay(700);
  
        // @ts-ignore
        const resp = await connection._rpcRequest("getSignatureStatuses", [
          [txid],
        ]);
  
        if (resp && resp.result && resp.result.value && resp.result.value[0]) {
          return txid;
        }
      }
    }
  
    return "";
  }
  
  function splitTransaction(
    wallet: any,
    instructions: TransactionInstruction[],
    signers: any = [],
    recentBlockhash: string
  ) {
    let arrIxSet: TransactionInstruction[][] = [];
    let setId = 0;
    for (let i = 0; i < instructions.length; ) {
      if (arrIxSet[setId] === undefined) arrIxSet[setId] = [];
      arrIxSet[setId].push(instructions[i]);
      let tx = new Transaction().add(...arrIxSet[setId]);
      tx.recentBlockhash = recentBlockhash;
      tx.feePayer = wallet.publicKey;
      if (getTransactionSize(tx, signers) > PACKET_DATA_SIZE) {
        arrIxSet[setId].pop();
        setId++;
        continue;
      }
      i++;
    }
    return arrIxSet;
  }
  
  export function getTransactionSize(
    transaction: Transaction,
    signers: any = [],
    hasWallet: boolean = true
  ) {
    const signData = transaction.serializeMessage();
    const signatureCount: number[] = [];
    encodeLength(signatureCount, signers.length);
    const transactionLength =
      signatureCount.length +
      (signers.length + (hasWallet ? 1 : 0)) * 64 +
      signData.length;
    return transactionLength;
  }
  
  function encodeLength(bytes: Array<number>, len: number) {
    let rem_len = len;
    for (;;) {
      let elem = rem_len & 0x7f;
      rem_len >>= 7;
      if (rem_len == 0) {
        bytes.push(elem);
        break;
      } else {
        elem |= 0x80;
        bytes.push(elem);
      }
    }
  }
  