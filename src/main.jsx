import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './index.css';


const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
createRoot(document.getElementById('root')).render(
  <StrictMode>

      <App />

  </StrictMode>
);