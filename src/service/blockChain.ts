import { Block, BlockContent, File } from '../model';
import { generateHash, getPrivateKey, sign } from './crypto';
import { updateFile } from './file';
import { connectDb, getAll, insertOnDB } from './indexDb';

const generateBlockSignature = async (
  lastBlockHash: string,
  payload: BlockContent
): Promise<string> => {
  const cryptoKey = await getPrivateKey();
  const signature = await sign(
    cryptoKey,
    JSON.stringify({ lastBlockHash, payload })
  );
  return signature;
};

const getBlockHash = async (block: Block) => {
  const digest = await generateHash(JSON.stringify(block));
  return digest;
};

export const initChain = async (file: File): Promise<string> => {
  const payload: BlockContent = {
    content: '',
    date: file.date,
    hasPasteContent: false,
  };
  const signature = await generateBlockSignature('', payload);
  const block: Block = {
    lastBlockHash: '',
    payload,
    signature,
  };
  const db = await connectDb(file.url);
  await insertOnDB(db, 'blocks', block);
  const blockHash = await getBlockHash(block);
  await saveLastBlockHash(blockHash, file);
  return blockHash;
};

export const addBlock = async (
  file: File,
  payload: BlockContent
): Promise<string> => {
  const lastBlockHash = getLastBlockHash(file);
  const signature = await generateBlockSignature(lastBlockHash, payload);
  const block: Block = {
    lastBlockHash,
    payload,
    signature,
  };

  const db = await connectDb(file.url);
  await insertOnDB(db, 'blocks', block);
  const blockHash = await getBlockHash(block);
  await saveLastBlockHash(blockHash, file);
  return blockHash;
};

export const saveLastBlockHash = async (hash: string, file: File) => {
  const newFIle = { ...file, lastHash: hash };
  await updateFile(file.url, newFIle);
};

export const getLastBlockHash = (file: File) => {
  return file.lastHash || '';
};

export const downloadBlockChain = async (file: File) => {
  const db = await connectDb(file.url);
  const blocks = await getAll<Block>(db, 'blocks');
  const sortedBlocks = blocks.sort(
    (a, b) => a.payload.date.getTime() - b.payload.date.getTime()
  );
  return sortedBlocks.reduce((result, block) => {
    const base64 = btoa(encodeURI(JSON.stringify(block)));
    return `${result}${base64}\n`;
  }, '');
};
