import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import App from './app/App'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const rerenderEntireTree = () => {
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
}

rerenderEntireTree()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', () => {
    rerenderEntireTree()
  })
}
