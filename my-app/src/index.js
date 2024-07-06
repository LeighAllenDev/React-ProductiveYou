import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CurrentUserProvider } from './contexts/CurrentUser';
import { BrowserRouter } from 'react-router-dom'; // Correct import
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CurrentUserProvider>
  </React.StrictMode>
);

reportWebVitals();
