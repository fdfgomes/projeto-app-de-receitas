import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ContextProvider from './context/ContextProvider';
import App from './App';
import './index.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <BrowserRouter>
      <ContextProvider>
        <App />
      </ContextProvider>
    </BrowserRouter>,
  );
