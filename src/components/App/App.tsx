import { useState } from 'react';
import { componentContext } from '../../context/components';
import { GenerateTCTFile } from '../GenerateTCTFile';
import { StartTrack } from '../StartTrack';
import './App.css';

export const App = () => {
  const [file, setFile] = useState('');
  return (
    <div className="App">
      <componentContext.Provider value={{ file, setFile }}>
        {file ? (
          <GenerateTCTFile url={file}></GenerateTCTFile>
        ) : (
          <StartTrack></StartTrack>
        )}
      </componentContext.Provider>
    </div>
  );
};
