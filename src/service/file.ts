import { File } from '../model';
import { sanitizeUrl } from '../utils';
import { getLocalStorage, setLocalStorage } from './chrome';

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
  await setLocalStorage('file', file);
  return file;
};

export const getFile = async () => {
  const tct = await getLocalStorage<File>('file');
  return tct;
};
