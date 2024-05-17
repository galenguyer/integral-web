import React, { useEffect } from 'react';

const FeaturesContext = React.createContext<any>(null);

export const FeaturesProvider = ({ children }: { children: any }) => {
  const [features, setFeatures] = React.useState(null);

  useEffect(() => {
    fetch('/api/v0/features')
      .then((response) => response.json())
      .then((data) => {
        console.debug('features:', data);
        setFeatures(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <FeaturesContext.Provider value={features}>
      {children}
    </FeaturesContext.Provider>
  );
};

export function useFeatures() {
  return React.useContext(FeaturesContext);
}
