import { File } from '../model';
import { sanitizeUrl } from '../utils';
import { connectDb, getAll, insertOnDB, updateOnDb } from './indexDb';

export const initFile = async ({
  title,
  url,
  date = new Date(),
}: {
  title: string;
  url: string;
  date: Date;
}) => {
  const sanitizedUrl = sanitizeUrl(url);
  const file: File = {
    name: title,
    date,
    url: sanitizedUrl,
  };
  const db = await connectDb(sanitizedUrl);
  await insertOnDB(db, 'files', file);
  return file;
};

export const getFile = async (key: string) => {
  const db = await connectDb(key);
  const files = await getAll<File>(db, 'files');
  return files[0];
};

export const updateFile = async (key: string, file: File) => {
  const db = await connectDb(key);
  await updateOnDb<File>(db, 'files', file);
};

export const getFiles = async (): Promise<Array<File>> => {
  const databases = await indexedDB.databases();
  const files = await Promise.all(
    databases
      .filter(database => database.name)
      .map(async database => {
        const file = await getFile(database.name || '');
        return file;
      })
  );
  return files;
};
