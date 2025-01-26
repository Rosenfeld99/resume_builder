import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { TemplateContextProvider } from './context/TemplateContext.jsx'
import { ResumeContextProvider } from './context/ResumeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TemplateContextProvider>
    <ResumeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ResumeContextProvider>
  </TemplateContextProvider>
)
