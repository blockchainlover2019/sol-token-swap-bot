import { PublicKey } from "@solana/web3.js";
import {
  SETTINGS_SEED,
  POOL_SEED,
  BOTROLE_SEED,
  PROGRAM_ID,
} from "./constants";

export const getSettingsKey = async () => {
  const [settingsKey] = await asyncGetPda(
    [Buffer.from(SETTINGS_SEED)],
    PROGRAM_ID
  );
  console.log("settingsKey:", settingsKey);
  
  return settingsKey;
};

export const getPoolKey = async () => {
  const [poolKey] = await asyncGetPda([Buffer.from(POOL_SEED)], PROGRAM_ID);
  console.log("poolKey:", poolKey);
  return poolKey;
};

export const getBotRoleKey = async () => {
  const [botroleKey] = await asyncGetPda(
    [Buffer.from(BOTROLE_SEED)],
    PROGRAM_ID
  );
  console.log("botroleKey:", botroleKey);
  return botroleKey;
};

const asyncGetPda = async (
  seeds: Buffer[],
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};
