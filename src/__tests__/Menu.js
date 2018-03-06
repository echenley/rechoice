import * as React from 'react'
import { shallow } from 'enzyme'
import getClasses from '../util/getClasses'
import Menu from '../Menu'

const item3 = { id: 3 }

// prettier-ignore
const items = [
  { id: 1 },
  { id: 2 },
  item3,
  { id: 4 },
  { id: 5 },
]

const renderComponent = props => {
  return shallow(
    <Menu
      classes={getClasses()}
      controlsId="controls-id"
      focusedItemIndex={2}
      getItemId={i => `item-${i}`}
      inputValue="test"
      isItemSelected={item => item.id === 4}
      isOpen={true}
      itemKey="id"
      items={items}
      loadingIndicator={<div className="loading-indicator" />}
      onHoverItem={() => {}}
      onSelect={() => {}}
      renderItem={({ item }) => <div>{item.id}</div>}
      setFocusedItemRef={() => {}}
      setMenuRef={() => {}}
      state="success"
      {...props}
    />
  )
}

describe('Menu', () => {
  it('renders correctly', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  it('calls onSelect when an item is clicked', () => {
    const onSelect = jest.fn()
    const component = renderComponent({ onSelect })
    component.find('#item-0').simulate('click')
    expect(onSelect).toHaveBeenCalledWith({ id: 1 })
  })

  it('calls onHoverItem when item is moused over', () => {
    const onHoverItem = jest.fn()
    const component = renderComponent({ onHoverItem })
    component.find('#item-2').simulate('mouseenter')
    expect(onHoverItem).toHaveBeenCalledWith(2)
  })
})
