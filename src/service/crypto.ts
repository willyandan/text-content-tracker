import { HmacSHA1, SHA256 } from 'crypto-js';

export const getPrivateKey = async () => {
  return 'hellomom';
};

export const sign = async (key: string, data: string): Promise<string> => {
  const sign = HmacSHA1(data, key);
  return sign.toString();
};

export const generateHash = async (data: string): Promise<string> => {
  const digest = SHA256(data);
  return digest.toString();
};
