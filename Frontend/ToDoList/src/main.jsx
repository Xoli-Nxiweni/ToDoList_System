import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeDb } from './Db.js'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
  initializeDb().then(()=>{
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }).catch(error => {
    console.error(`database initialization failed`, error)
  });
