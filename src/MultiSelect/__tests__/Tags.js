import * as React from 'react'
import { shallow } from 'enzyme'
import Tags from '../Tags'

const renderTag = ({ item, removeTag }) => (
  <button onClick={removeTag}>{`Item ${item.id}`}</button>
)

const renderComponent = props => {
  return shallow(
    <Tags
      className="tags"
      itemKey="id"
      removeTag={() => {}}
      renderTag={renderTag}
      value={[{ id: 1 }, { id: 2 }]}
      {...props}
    />
  )
}

describe('Tags', () => {
  it('renders correctly', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  it('calls onChange with updated value when removeTag is called', () => {
    const removeTag = jest.fn()
    const component = renderComponent({ removeTag })

    component
      .find('button')
      .first()
      .simulate('click')

    expect(removeTag).toHaveBeenCalledWith({ id: 1 })
  })
})
