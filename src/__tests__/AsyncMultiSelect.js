import * as React from 'react'
import { shallow } from 'enzyme'
import AsyncMultiSelect from '../AsyncMultiSelect'

const renderComponent = props => {
  return shallow(
    <AsyncMultiSelect
      itemKey="id"
      loadItems={() => Promise.resolve({ items: [] })}
      loadingIndicator={<div className="loading-indicator" />}
      onChange={() => {}}
      onFocus={() => {}}
      onInputChange={() => {}}
      placeholder="Placeholder"
      renderItem={() => <div />}
      renderTag={item => <div>{item.id}</div>}
      value={[]}
      {...props}
    />
  )
}

describe('AsyncMultiSelect', () => {
  it('renders correctly', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  it('renders a MultiSelect child', () => {
    expect(
      renderComponent()
        .dive()
        .getElement()
    ).toMatchSnapshot()
  })
})
