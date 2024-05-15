import React, { useState } from 'react';

const HeaderContext = React.createContext<any>(null);

export const HeaderProvider = ({ children }: { children: any }) => {
  const [{ brand, link, info }, setHeader] = useState({
    brand: 'Integral CAD',
    link: '/',
    info: undefined,
  });

  const value = { brand, link, info, setHeader };

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
};

export const useHeader = () => {
  return React.useContext(HeaderContext);
};
