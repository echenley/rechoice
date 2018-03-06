import * as React from 'react'
import { shallow } from 'enzyme'
import Async from '../Async'

jest.useFakeTimers()

const renderComponent = props => {
  return shallow(
    <Async
      // eslint-disable-next-line react/no-children-prop
      children={asyncProps => <div>{JSON.stringify(asyncProps)}</div>}
      loadItems={() => Promise.resolve({ items: [{ id: 1 }] })}
      minimumInput={0}
      {...props}
    />
  )
}

describe('Async', () => {
  it('renders function children prop', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  describe('loadItems', () => {
    it('sets state correctly if minimumInput is not met', () => {
      const children = jest.fn(() => <div />)

      const component = renderComponent({
        children,
        minimumInput: 3,
      })

      component.setState({
        items: [{ id: 1 }, { id: 2 }],
      })

      children.mock.calls[0][0].onInputChange('ab')

      expect(component.state('loadingState')).toBe('success')
      expect(component.state('items')).toEqual([])
    })

    it('calls loadItems (promise version) and updates items and loadingState', async () => {
      const children = jest.fn(() => <div />)

      const component = renderComponent({
        children,
      })

      component.setState({
        items: [{ id: 1 }, { id: 2 }],
      })

      const promise = children.mock.calls[0][0].onInputChange('test')

      expect(component.state('loadingState')).toBe('loading')

      await promise

      expect(component.state('loadingState')).toBe('success')
      expect(component.state('items')).toEqual([{ id: 1 }])
    })

    it('calls loadItems (callback version) and updates items and loadingState', () => {
      return new Promise((resolve, reject) => {
        const children = jest.fn(() => <div />)

        const component = renderComponent({
          children,
          loadItems: (input, cb) => {
            setTimeout(() => {
              cb(null, { items: [{ id: 1 }] })

              component.update()

              try {
                expect(component.state('loadingState')).toBe('success')
                expect(component.state('items')).toEqual([{ id: 1 }])
              } catch (err) {
                return reject(err)
              }

              return resolve()
            }, 0)
          },
        })

        component.setState({
          items: [{ id: 1 }, { id: 2 }],
        })

        children.mock.calls[0][0].onInputChange('test')

        jest.runAllTimers()

        try {
          expect(component.state('loadingState')).toBe('loading')
        } catch (err) {
          reject(err)
        }
      })
    })
  })

  it('loads items onFocus if not yet loaded', async () => {
    const children = ({ onFocus }) => <input onFocus={onFocus} />
    const loadItems = jest.fn()

    const component = renderComponent({
      children,
      loadItems,
    })

    component.find('input').simulate('focus')

    expect(loadItems).toHaveBeenCalled()
    loadItems.mockClear()

    component.find('input').simulate('focus')
    expect(loadItems).not.toHaveBeenCalled()
  })
})
