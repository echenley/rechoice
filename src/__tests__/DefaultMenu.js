import * as React from 'react'
import { shallow } from 'enzyme'
import DefaultMenu from '../DefaultMenu'

const children = [
  <div key="1">{'Child 1'}</div>,
  <div key="2">{'Child 2'}</div>,
  <div key="3">{'Child 3'}</div>,
]

const renderComponent = props => {
  return shallow(
    <DefaultMenu
      // eslint-disable-next-line react/no-children-prop
      children={children}
      className="className"
      isOpen={true}
      listProps={{ listProp1: 'listProp1' }}
      setMenuRef={() => {}}
      state="success"
      {...props}
    />
  )
}

describe('DefaultMenu', () => {
  it('renders correctly when loading', () => {
    expect(renderComponent({ state: 'loading' }).getElement()).toMatchSnapshot()
  })

  it('renders loadingIndicator if available', () => {
    expect(
      renderComponent({
        state: 'loading',
        loadingIndicator: <div className="loading-indicator" />,
      }).getElement()
    ).toMatchSnapshot()
  })

  it('renders correctly for an error', () => {
    expect(renderComponent({ state: 'error' }).getElement()).toMatchSnapshot()
  })

  it('renders correctly with no results', () => {
    expect(renderComponent({ children: [] }).getElement()).toMatchSnapshot()
  })

  it('renders correctly with results', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  it('renders correctly when isOpen is false (null)', () => {
    expect(renderComponent({ isOpen: false }).getElement()).toMatchSnapshot()
  })
})
