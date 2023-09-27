import React from 'react'
import ReactDOM from 'react-dom/client'

import 'virtual:windi.css'
import NProgress from 'nprogress'
import App from './App.tsx'
import './overwrite.css'


NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
  parent: '#root'
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
