import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import { store } from './app/store';
import AppErrorBoundary from './components/errorWrapper/AppErrorBoundary';
import GlobalErrorProvider from './features/error/GlobalErrorProvider';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />

        <GlobalErrorProvider>
          <AppErrorBoundary>
            <App />
          </AppErrorBoundary>
        </GlobalErrorProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
