import React from 'react'
import { Provider } from 'react-redux'
import IndexRouter from './router/IndexRouter'
import store from './redux/store'
import './App.css'

export default function App() {
  return (
      <Provider store={store}>
        <IndexRouter></IndexRouter>
      </Provider>
  )
}
