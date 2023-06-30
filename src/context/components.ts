import React from 'react';

export const componentContext = React.createContext<{
  file: string;
  setFile: (param: string) => void;
}>({
  file: '',
  setFile: () => {
    return;
  },
});
