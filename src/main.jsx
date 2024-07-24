import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { TemplateContextProvider } from './context/TemplateContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TemplateContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </TemplateContextProvider>
)
