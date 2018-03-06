import {
  focusPreviousItem,
  focusNextItem,
  updateInputValue,
  focusInput,
} from '../state'

const baseState = {
  filteredItems: [{ id: '1' }, { id: '2' }, { id: '3' }],
  focusedItemIndex: 1,
  inputValue: '1',
  isFocused: true,
  isOpen: true,
}

const baseProps = {
  filterItems: items => items,
  minimumInput: 0,
  itemKey: 'id',
  items: [{ id: '1' }, { id: '2' }, { id: '3' }],
  value: null,
}

describe('state transforms', () => {
  describe('focusPreviousItem', () => {
    it('does not change focusedItemIndex if state.isOpen === false', () => {
      const state = {
        ...baseState,
        isOpen: false,
      }

      expect(focusPreviousItem(state, baseProps)).toMatchSnapshot()
    })

    it('focuses previous item', () => {
      expect(focusPreviousItem(baseState, baseProps)).toMatchSnapshot()
    })

    it('wraps around to last item', () => {
      const state = {
        ...baseState,
        focusedItemIndex: 0,
      }

      expect(focusPreviousItem(state, baseProps)).toMatchSnapshot()
    })

    it('focuses value if no focusedItemIndex', () => {
      const state = {
        ...baseState,
        focusedItemIndex: null,
      }

      const props = {
        ...baseProps,
        value: { id: '3' },
      }

      expect(focusPreviousItem(state, props)).toMatchSnapshot()
    })

    it('focuses first item if no focusedItemIndex and value is an array', () => {
      const state = {
        ...baseState,
        focusedItemIndex: null,
      }

      const props = {
        ...props,
        value: [{ id: '3' }],
      }

      expect(focusPreviousItem(state, props)).toMatchSnapshot()
    })
  })

  describe('focusNextItem', () => {
    it('focuses next item', () => {
      expect(focusNextItem(baseState, baseProps)).toMatchSnapshot()
    })

    it('wraps around to first item', () => {
      const state = {
        ...baseState,
        focusedItemIndex: 2,
      }

      expect(focusNextItem(state, baseProps)).toMatchSnapshot()
    })

    it('focuses value if no focusedItemIndex', () => {
      const state = {
        ...baseState,
        focusedItemIndex: null,
      }

      const props = {
        ...baseProps,
        value: { id: '2' },
      }

      expect(focusNextItem(state, props)).toMatchSnapshot()
    })

    it('focuses first item if no focusedItemIndex and value is an array', () => {
      const state = {
        ...baseState,
        focusedItemIndex: null,
      }

      const props = {
        ...props,
        value: [{ id: '3' }],
      }

      expect(focusNextItem(state, props)).toMatchSnapshot()
    })
  })

  describe('updateInputValue', () => {
    it('simply opens the input if loadingState === "loading"', () => {
      const props = {
        ...baseProps,
        loadingState: 'loading',
      }

      expect(updateInputValue(baseState, props, 'newValue')).toMatchSnapshot()
    })

    it('does not open the input if minimumInput is not reached', () => {
      const props = {
        ...baseProps,
        minimumInput: 3,
        loadingState: 'loading',
      }

      expect(updateInputValue(baseState, props, 'ab')).toMatchSnapshot()
    })

    it('filters items and keeps previously focused item if it is still in filteredItems', () => {
      expect(updateInputValue(baseState, baseProps, 'ab')).toMatchSnapshot()
    })

    it('filters items and focuses value if focusedItemIndex is null', () => {
      const props = {
        ...baseProps,
        filterItems: () => [{ id: '1' }, { id: '3' }],
        focusedItemIndex: null,
        value: { id: '3' },
      }

      expect(updateInputValue(baseState, props, 'ab')).toMatchSnapshot()
    })

    it('filters items and focuses first item if both value and focusedItemIndex are null', () => {
      const props = {
        ...baseProps,
        filterItems: () => [{ id: '1' }, { id: '3' }],
        focusedItemIndex: null,
        value: null,
      }

      expect(updateInputValue(baseState, props, 'ab')).toMatchSnapshot()
    })
  })

  describe('focusInput', () => {
    it('simply sets isFocused if below minimumInput', () => {
      const props = {
        ...baseProps,
        minimumInput: 3,
      }

      expect(focusInput(baseState, props)).toMatchSnapshot()
    })

    it('filters items and focuses value if focusedItemIndex is null', () => {
      const props = {
        ...baseProps,
        filterItems: () => [{ id: '1' }, { id: '3' }],
        value: { id: '3' },
      }

      expect(updateInputValue(baseState, props, 'ab')).toMatchSnapshot()
    })

    it('filters items and focuses first item if both value and focusedItemIndex are null or no longer in filteredItems', () => {
      const props = {
        ...baseProps,
        filterItems: () => [{ id: '1' }, { id: '3' }],
        focusedItemIndex: null,
        value: null,
      }

      expect(updateInputValue(baseState, props, 'ab')).toMatchSnapshot()
    })

    it('opens and sets focusedItemIndex to index of current value if focusedItemIndex is null and minimumInput is met', () => {
      const props = {
        ...baseProps,
        filterItems: () => [{ id: '1' }, { id: '3' }],
        focusedItemIndex: null,
        value: { id: '3' },
      }

      expect(focusInput(baseState, props)).toMatchSnapshot()
    })

    it('opens and sets focusedItemIndex to 0 if value is missing from filteredItems, focusedItemIndex is null, and minimumInput is met', () => {
      const props = {
        ...baseProps,
        filterItems: () => [{ id: '1' }, { id: '3' }],
        value: { id: '2' },
      }

      expect(focusInput(baseState, props)).toMatchSnapshot()
    })
  })
})
