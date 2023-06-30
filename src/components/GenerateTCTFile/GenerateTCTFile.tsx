import { useCallback, useEffect, useState } from 'react';
import { File } from '../../model';
import { downloadBlockChain, getFile } from '../../service';
import './GenerateTCTFile.css';

export const GenerateTCTFile = ({ url }: { url: string }) => {
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>({
    name: '',
    date: new Date(),
    url: '',
  });

  const fetchFile = useCallback(async () => {
    const file = await getFile(url);
    setFile(file);
  }, []);
  useEffect(() => {
    fetchFile();
  }, [url, fetchFile]);

  const downloadFile = async () => {
    const stringFile = await downloadBlockChain(file);
    const element = document.createElement('a');
    const tctFile = new Blob([stringFile], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(tctFile);
    element.download = `${file.name}.tct`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className={`loader ${onLoading && `onloading`}`}></div>
      </div>
      <p className="text-left">
        <b>Nome do arquivo:</b> {file.name}
      </p>
      <p className="text-left">
        <b>Data de criação:</b> {file.date.toISOString()}
      </p>
      <br />
      <button
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          setOnLoading(true);
          downloadFile();
        }}
      >
        Baixar arquivo
      </button>
    </div>
  );
};
