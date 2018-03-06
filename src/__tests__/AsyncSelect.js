import * as React from 'react'
import { shallow } from 'enzyme'
import AsyncSelect from '../AsyncSelect'

const renderComponent = props => {
  return shallow(
    <AsyncSelect
      itemKey="id"
      loadItems={() => Promise.resolve({ items: [] })}
      loadingIndicator={<div className="loading-indicator" />}
      onChange={() => {}}
      onFocus={() => {}}
      placeholder="Placeholder"
      renderItem={() => <div />}
      renderSelected={item => item.id}
      value={null}
      {...props}
    />
  )
}

describe('AsyncSelect', () => {
  it('renders correctly', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  it('renders a Select child', () => {
    expect(
      renderComponent()
        .dive()
        .getElement()
    ).toMatchSnapshot()
  })
})
