import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './hooks/useAuth';

import '@mantine/core/styles.css';
import { HeaderProvider } from './hooks/useHeader.tsx';
import { BrowserRouter } from 'react-router-dom';
import { FeaturesProvider } from './hooks/useFeatures.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <AuthProvider>
          <HeaderProvider>
            <FeaturesProvider>
              <App />
            </FeaturesProvider>
          </HeaderProvider>
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
