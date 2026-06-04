import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("SovereignGate: Mounting React Root...");

const root = document.getElementById('root');
if (!root) {
  console.error("SovereignGate: Root element not found!");
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log("SovereignGate: Render called.");
}
