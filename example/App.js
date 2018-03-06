// @flow

import * as React from 'react'
import SelectExample from './components/SelectExample'
import AsyncSelectExample from './components/AsyncSelectExample'
import MultiSelectExample from './components/MultiSelectExample'
import AsyncMultiSelectExample from './components/AsyncMultiSelectExample'
import ReactOverlaysExample from './components/ReactOverlaysExample'
import ReactPopperExample from './components/ReactPopperExample'

const App = () => {
  return (
    <main>
      <h1>{'Rechoice'}</h1>
      <SelectExample />
      <AsyncSelectExample />
      <MultiSelectExample />
      <AsyncMultiSelectExample />
      <ReactOverlaysExample />
      <ReactPopperExample />
    </main>
  )
}

export default App
