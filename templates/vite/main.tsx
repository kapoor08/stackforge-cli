import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
{{importCss}}
{{providersImport}}
{{initImports}}
{{initCalls}}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {{wrapApp}}
  </React.StrictMode>
);
