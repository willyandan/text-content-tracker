import { useState } from 'react';
import './GenerateTCTFile.css';

export const GenerateTCTFile = () => {
  const [onLoading, setOnLoading] = useState<boolean>(false);
  return (
    <div>
      <div className="flex justify-center">
        <div className={`loader ${onLoading && `onloading`}`}></div>
      </div>
      <p className="text-left">
        <b>Nome do arquivo:</b> Resume - Willyan Antunes
      </p>
      <p className="text-left">
        <b>Data de criação:</b> 16/06/2023
      </p>
      <br />
      <button
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          setOnLoading(true);
        }}
      >
        Baixar arquivo
      </button>
    </div>
  );
};
