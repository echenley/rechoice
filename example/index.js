import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './styles/main.scss'

const rootEl = document.getElementById('root')

function render(AppComponent) {
  ReactDOM.render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    rootEl
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}
