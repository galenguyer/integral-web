import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { MantineProvider, DEFAULT_THEME } from '@mantine/core';
import { AuthProvider } from './hooks/useAuth';

import '@mantine/core/styles.css';
import { HeaderProvider } from './hooks/useHeader.tsx';
import { BrowserRouter } from 'react-router-dom';
import { FeaturesProvider } from './hooks/useFeatures.tsx';
import { SystemProvider } from './hooks/useSystem.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={DEFAULT_THEME}>
        <AuthProvider>
          <HeaderProvider>
            <FeaturesProvider>
              <SystemProvider>
                <App />
              </SystemProvider>
            </FeaturesProvider>
          </HeaderProvider>
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
