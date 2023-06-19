import { Block, BlockContent, File } from '../model';
import { arrayBufferToBase64 } from '../utils';
import { getLocalStorage } from './chrome';
import { connectDb, insertOnDB } from './indexDb';

const generateBlockSignature = async (
  lastBlockHash: string,
  payload: BlockContent
): Promise<string> => {
  const privateKey = 'hellomom';
  const textEncoder = new TextEncoder();
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    textEncoder.encode(privateKey),
    {
      name: 'HMAC',
      hash: { name: 'SHA-512' },
    },
    false,
    ['sign']
  );
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    textEncoder.encode(JSON.stringify({ lastBlockHash, payload }))
  );
  return arrayBufferToBase64(signature);
};

const getBlockHash = async (block: Block) => {
  const textEncoder = new TextEncoder();
  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    textEncoder.encode(JSON.stringify(block))
  );
  return arrayBufferToBase64(digest);
};

export const initChain = async (file: File): Promise<string> => {
  const payload: BlockContent = {
    content: '',
    dateStart: file.date,
    dateEnd: file.date,
    hasPasteContent: false,
  };
  const signature = await generateBlockSignature('', payload);
  console.log({ signature });
  console.log({ lastBlockHash: '', payload });
  const block: Block = {
    lastBlockHash: '',
    payload,
    signature,
  };
  const db = await connectDb(file.url);
  await insertOnDB(db, 'blocks', block);
  const blockHash = await getBlockHash(block);
  return blockHash;
};

export const addBlock = async (
  file: File,
  payload: BlockContent
): Promise<string> => {
  const lastBlockHash = await getLocalStorage<string>('LAST_BLOCK_HASH');
  const signature = await generateBlockSignature(lastBlockHash, payload);
  const block: Block = {
    lastBlockHash,
    payload,
    signature,
  };
  const db = await connectDb(file.url);
  await insertOnDB(db, 'blocks', block);
  const blockHash = await getBlockHash(block);
  return blockHash;
};
