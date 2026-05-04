  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import Header from './components/layout/Header';
  import './index.css';
  import Footer from './components/layout/Footer';

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

