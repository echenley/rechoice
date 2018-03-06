/* eslint-disable max-nested-callbacks */

jest.mock('../util/clickListener')
jest.mock('../util/contains')
jest.mock('../util/scrollIntoView')

jest.useFakeTimers()

import * as React from 'react'
import { shallow } from 'enzyme'
import { addClickListener, removeClickListener } from '../util/clickListener'
import contains from '../util/contains'
import keyCodes from '../util/keyCodes'
import scrollIntoView from '../util/scrollIntoView'
import Select from '../Select'
import Menu from '../Menu'

contains.mockImplementation(() => false)

const value = { id: 3, label: 'three' }

// prettier-ignore
const items = [
  { id: 1, label: 'one' },
  { id: 2, label: 'two' },
  value,
  { id: 4, label: 'four' },
  { id: 5, label: 'five' },
]

const renderComponent = props => {
  return shallow(
    <Select
      getInputValue={item => item.label}
      itemKey="id"
      items={items}
      loadingIndicator={<div className="loading-indicator" />}
      onBlur={() => {}}
      onChange={() => {}}
      onFocus={() => {}}
      placeholder="Placeholder…"
      renderItem={() => {}}
      value={value}
      {...props}
    />
  )
}

describe('Select', () => {
  afterEach(() => {
    clearTimeout.mockClear()
    scrollIntoView.mockClear()
  })

  it('renders correctly', () => {
    expect(renderComponent().getElement()).toMatchSnapshot()
  })

  it('renders correctly when isOpen state to be overridden by props.isOpen', () => {
    const component = renderComponent({ isOpen: true })
    expect(component.find(Menu).prop('isOpen')).toBe(true)
  })

  it('adds "disabled" class and disables input when disabled', () => {
    const component = renderComponent({ disabled: true })
    expect(component.hasClass('disabled')).toBe(true)
    expect(component.find('input').prop('disabled')).toBe(true)
  })

  it('adds focused class when isFocused and calls onFocus props if provided', () => {
    const onFocus = jest.fn()
    const component = renderComponent({ onFocus })
    component.instance().onInputFocus()
    component.update()
    expect(component.hasClass('focused')).toBe(true)
    expect(onFocus).toHaveBeenCalled()
  })

  it('calls scrollIntoView when input is focused', () => {
    const component = renderComponent()
    const instance = component.instance()

    instance.menuNode = { id: 'menuNode' }
    instance.focusedItemNode = { id: 'focusedItemNode' }

    component.find('input').prop('onFocus')()

    expect(scrollIntoView).toHaveBeenCalledWith(
      instance.focusedItemNode,
      instance.menuNode
    )
  })

  describe('Methods', () => {
    describe('componentDidMount', () => {
      it('calls addClickListener', () => {
        const component = renderComponent()
        component.instance().componentDidMount()
        expect(addClickListener).toHaveBeenCalledWith(
          component.instance().onDocumentClick
        )
      })
    })

    describe('componentWillReceiveProps', () => {
      it('updates filteredItems if props.items changes', () => {
        const component = renderComponent()
        const newItems = [...items, { id: 6 }]
        component.setProps({
          items: newItems,
        })

        expect(component.state('filteredItems')).toEqual(newItems)
      })
    })

    describe('componentWillUnmount', () => {
      it('calls removeClickListener', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.clearBlurTimer = jest.fn()
        instance.componentWillUnmount()

        expect(removeClickListener).toHaveBeenCalledWith(
          instance.onDocumentClick
        )
        expect(instance.clearBlurTimer).toHaveBeenCalled()
      })
    })

    describe('close', () => {
      it('sets closed state', () => {
        const onInputChange = jest.fn()
        const component = renderComponent({ onInputChange })
        component.setState({
          inputValue: 'something',
          isOpen: true,
          isFocused: true,
        })

        component.instance().close()

        expect(component.state('isOpen')).toBe(false)
        expect(component.state('isFocused')).toBe(false)
        expect(component.state('inputValue')).toBe('three')
        expect(onInputChange).toHaveBeenCalledWith('three')
      })

      it('does not clear inputValue if resetInputOnBlur is false', () => {
        const component = renderComponent({
          resetInputOnBlur: false,
        })
        component.setState({
          inputValue: 'something',
          isOpen: true,
          isFocused: true,
        })

        component.instance().close()

        expect(component.state('isOpen')).toBe(false)
        expect(component.state('isFocused')).toBe(false)
        expect(component.state('inputValue')).toBe('something')
      })
    })

    describe('focusInput', () => {
      it('calls .focus() on input node', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.inputNode = { focus: jest.fn() }
        instance.focusInput()
        expect(instance.inputNode.focus).toHaveBeenCalled()
      })

      it('does not call .focus() if input node is null', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.inputNode = undefined
        expect(() => instance.focusInput()).not.toThrow()
      })
    })

    describe('clearBlurTimer', () => {
      it('calls clearTimeout on this.blurTimer', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.blurTimer = 111
        instance.clearBlurTimer()
        expect(clearTimeout).toHaveBeenCalledWith(111)
      })

      it('is a no-op if this.blurTimer is null', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.blurTimer = null
        instance.clearBlurTimer()
        expect(clearTimeout).not.toHaveBeenCalled()
      })
    })

    describe('onDocumentClick', () => {
      it('calls this.close if click target was not within the select or popover', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.close = jest.fn()
        instance.rootNode = {}
        instance.menuNode = {}
        instance.onDocumentClick({ target: document.createElement('div') })
        expect(instance.close).toHaveBeenCalled()
      })

      it('does not call this.close if click target was outside the select and popover', () => {
        contains.mockImplementationOnce(() => true)
        const component = renderComponent()
        const instance = component.instance()
        instance.close = jest.fn()
        instance.onDocumentClick({ target: {} })
        expect(instance.close).not.toHaveBeenCalled()
      })
    })

    describe('onHoverItem', () => {
      it('sets focusedItemIndex', () => {
        const component = renderComponent()
        component.find(Menu).prop('onHoverItem')(10)
        expect(component.state('focusedItemIndex')).toBe(10)
      })
    })

    describe('onInputBlur', () => {
      it('calls onBlur prop if provided', () => {
        const onBlur = jest.fn()
        const component = renderComponent({
          onBlur,
        })
        const instance = component.instance()
        instance.close = jest.fn()
        instance.clearBlurTimer = jest.fn()
        instance.onInputBlur()

        expect(onBlur).toHaveBeenCalled()
      })

      it('calls clearBlurTimer and close after a setTimeout', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.close = jest.fn()
        instance.clearBlurTimer = jest.fn()
        instance.onInputBlur()

        expect(instance.clearBlurTimer).toHaveBeenCalled()
        expect(instance.close).not.toHaveBeenCalled()

        jest.runAllTimers()

        expect(instance.close).toHaveBeenCalled()
        expect(Boolean(instance.blurTimer)).toBe(true)
      })
    })

    describe('onInputFocus', () => {
      it('calls clearBlurTimer and updates state', () => {
        const component = renderComponent()
        const instance = component.instance()
        instance.clearBlurTimer = jest.fn()
        component.find('input').prop('onFocus')()
        expect(instance.clearBlurTimer).toHaveBeenCalled()
        expect(component.state()).toMatchSnapshot()
      })
    })

    describe('onKeyDown', () => {
      it('ENTER opens the popover and updates filteredItems if popover is closed', () => {
        const component = renderComponent({
          filterItems: () => [],
        })
        const instance = component.instance()

        component.setState({ isOpen: false })

        const e = {
          keyCode: keyCodes.ENTER,
          preventDefault: jest.fn(),
        }

        instance.onKeyDown(e)

        expect(component.state('isOpen')).toBe(true)
        expect(component.state('filteredItems')).toEqual([])
        expect(e.preventDefault).toHaveBeenCalled()
      })

      it('ENTER calls this.onSelect if popover is open and focused', () => {
        const component = renderComponent()
        const instance = component.instance()

        component.setState({
          focusedItemIndex: 2,
          inputValue: 'test',
          isOpen: true,
          isFocused: true,
        })

        const e = {
          keyCode: keyCodes.ENTER,
          preventDefault: jest.fn(),
        }

        instance.onSelect = jest.fn()
        instance.onKeyDown(e)

        expect(instance.onSelect).toHaveBeenCalledWith(value)
        expect(e.preventDefault).toHaveBeenCalled()
      })

      it('ENTER does nothing when loading', () => {
        const component = renderComponent({
          loadingState: 'loading',
        })
        const instance = component.instance()

        component.setState({
          focusedItemIndex: 2,
          inputValue: 'test',
          isOpen: true,
          isFocused: true,
        })

        const e = {
          keyCode: keyCodes.ENTER,
          preventDefault: jest.fn(),
        }

        instance.onSelect = jest.fn()
        instance.onKeyDown(e)

        expect(instance.onSelect).not.toHaveBeenCalled()
        expect(e.preventDefault).toHaveBeenCalled()
      })

      it('UP focuses previous item and calls scrollIntoView', () => {
        const component = renderComponent()
        const instance = component.instance()

        const e = {
          keyCode: keyCodes.UP,
          preventDefault: jest.fn(),
        }

        instance.menuNode = { id: 'menuNode' }
        instance.focusedItemNode = { id: 'focusedItemNode' }
        instance.focusPreviousItem = jest.fn(instance.focusPreviousItem)
        instance.onKeyDown(e)

        expect(instance.focusPreviousItem).toHaveBeenCalledWith()
        expect(e.preventDefault).toHaveBeenCalled()
        expect(scrollIntoView).toHaveBeenCalledWith(
          instance.focusedItemNode,
          instance.menuNode
        )
      })

      it('DOWN focuses next item and calls scrollIntoView', () => {
        const component = renderComponent()
        const instance = component.instance()

        const e = {
          keyCode: keyCodes.DOWN,
          preventDefault: jest.fn(),
        }

        instance.menuNode = { id: 'menuNode' }
        instance.focusedItemNode = { id: 'focusedItemNode' }
        instance.focusNextItem = jest.fn(instance.focusNextItem)
        instance.onKeyDown(e)

        expect(instance.focusNextItem).toHaveBeenCalledWith()
        expect(e.preventDefault).toHaveBeenCalled()
        expect(scrollIntoView).toHaveBeenCalledWith(
          instance.focusedItemNode,
          instance.menuNode
        )
      })

      function clearInputTest() {
        const onChange = jest.fn()
        const component = renderComponent({ onChange })
        const instance = component.instance()
        component.setState({ inputValue: '' })

        const e = {
          keyCode: keyCodes.BACKSPACE,
          preventDefault: jest.fn(),
        }

        instance.onKeyDown(e)

        expect(onChange).toHaveBeenCalledWith(null)
        expect(e.preventDefault).toHaveBeenCalled()
      }

      it(
        'BACKSPACE clears current selection if inputValue is empty',
        clearInputTest
      )

      it(
        'DELETE clears current selection if inputValue is empty',
        clearInputTest
      )

      it('does not preventDefault for any other keys', () => {
        const component = renderComponent()
        const instance = component.instance()

        const e = {
          keyCode: 100,
          preventDefault: jest.fn(),
        }

        instance.onKeyDown(e)
        expect(e.preventDefault).not.toHaveBeenCalled()
      })
    })

    describe('onSelect', () => {
      it('does nothing if item is null', () => {
        const onChange = jest.fn()
        const component = renderComponent({ onChange })
        const instance = component.instance()
        instance.onSelect(null)
        expect(onChange).not.toHaveBeenCalled()
      })

      it('sets input to new value, closes popover, and resets filteredItems', () => {
        const onChange = jest.fn()
        const onInputChange = jest.fn()
        const items = [{ id: 1 }, { id: 2 }, value, { id: 4 }]
        const component = renderComponent({
          onChange,
          onInputChange,
          items,
        })
        component.setState({
          filteredItems: [value],
          inputValue: 'test',
          isOpen: true,
        })
        const instance = component.instance()
        instance.focusInput = jest.fn()
        instance.onSelect(value)

        expect(onChange).toHaveBeenCalledWith(value)
        expect(instance.focusInput).toHaveBeenCalled()
        expect(component.state('inputValue')).toBe('three')
        expect(component.state('isOpen')).toBe(false)
        expect(component.state('filteredItems')).toBe(items)
        expect(onInputChange).toHaveBeenCalledWith('three')
      })
    })

    describe('onInputChange', () => {
      it('updates state with new input value', () => {
        const onInputChange = jest.fn()
        const component = renderComponent({
          onInputChange,
        })
        const instance = component.instance()
        instance.onInputChange({
          target: {
            value: 'test',
          },
        })

        expect(onInputChange).toHaveBeenCalledWith('test')
        expect(component.state()).toMatchSnapshot()
      })
    })

    describe('isItemSelected', () => {
      it('returns true if item matches props.value', () => {
        const component = renderComponent()
        expect(component.instance().isItemSelected({ id: 3 })).toBe(true)
      })

      it('returns false if item does not match props.value', () => {
        const component = renderComponent()
        expect(component.instance().isItemSelected({ id: 2 })).toBe(false)
      })
    })
  })
})
