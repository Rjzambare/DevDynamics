import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

const domNode = document.getElementById('root');
if (domNode) {
  const root = ReactDOM.createRoot(domNode);
  root.render(<App />);

  // Continue with your code using the 'root' variable
} else {
  console.error("Root element with ID 'root' not found in the document.");
}
// eslint-disable-line
