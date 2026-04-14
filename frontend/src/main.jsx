import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#f97316', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
