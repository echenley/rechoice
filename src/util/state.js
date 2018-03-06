// @flow

import type { FilterItems, Item, LoadingState } from '../types'

type Value = $Subtype<?Item | Array<Item>>

type Props = {
  filterItems: FilterItems<Value>,
  minimumInput: number,
  itemKey: string,
  items: Array<Item>,
  loadingState?: LoadingState,
  value: Value,
}

type State = {
  filteredItems: Array<Item>,
  focusedItemIndex: ?number,
  inputValue: string,
  isFocused: boolean,
  isOpen: boolean,
}

const updateFocusedItem = (
  state: $Shape<State>,
  props: Props,
  focusLast: boolean = false
) => {
  const newState = { ...state }
  const { value, itemKey } = props

  // default focus to current value for non-multi select
  if (value && !Array.isArray(value)) {
    const index = newState.filteredItems.findIndex(
      o => o[itemKey] === value[itemKey]
    )

    if (index !== -1) {
      newState.focusedItemIndex = index
    }
  }

  if (typeof newState.focusedItemIndex !== 'number') {
    newState.focusedItemIndex = focusLast
      ? newState.filteredItems.length - 1
      : 0
  }

  return newState
}

export function focusPreviousItem(state: State, props: Props) {
  const { minimumInput } = props
  const { filteredItems, focusedItemIndex, inputValue, isOpen } = state

  if (!filteredItems.length || inputValue.length < minimumInput) {
    return null
  }

  const newState: $Shape<State> = {
    filteredItems,
    isOpen: true,
  }

  if (
    typeof focusedItemIndex !== 'number' ||
    focusedItemIndex >= filteredItems.length
  ) {
    return updateFocusedItem(newState, props, true)
  }

  if (!isOpen) {
    return newState
  }

  let nextIndex = focusedItemIndex - 1
  if (nextIndex < 0) {
    nextIndex = filteredItems.length - 1
  }

  newState.focusedItemIndex = nextIndex
  return newState
}

export function focusNextItem(state: State, props: Props) {
  const { minimumInput } = props
  const { filteredItems, focusedItemIndex, inputValue, isOpen } = state

  if (!filteredItems.length || inputValue.length < minimumInput) {
    return null
  }

  const newState: $Shape<State> = {
    filteredItems,
    isOpen: true,
  }

  if (
    typeof focusedItemIndex !== 'number' ||
    focusedItemIndex >= filteredItems.length
  ) {
    return updateFocusedItem(newState, props)
  }

  if (!isOpen) {
    return newState
  }

  let nextIndex = focusedItemIndex + 1
  if (nextIndex === filteredItems.length) {
    nextIndex = 0
  }

  newState.focusedItemIndex = nextIndex
  return newState
}

export function updateInputValue(
  state: State,
  props: Props,
  inputValue: string
) {
  const { filterItems, minimumInput, items, loadingState, value } = props
  const { focusedItemIndex } = state

  let newState: $Shape<State> = {
    inputValue,
    isOpen: inputValue.length >= minimumInput,
  }

  if (loadingState !== 'loading') {
    newState.filteredItems = filterItems(items, inputValue, value)

    if (typeof focusedItemIndex !== 'number') {
      newState = updateFocusedItem(newState, props)
    }
  }

  return newState
}

export function focusInput(state: State, props: Props) {
  const { filterItems, minimumInput, items, value } = props
  const { focusedItemIndex } = state

  const newState: $Shape<State> = {
    isFocused: true,
  }

  if (state.inputValue.length >= minimumInput) {
    newState.isOpen = true
    newState.filteredItems = filterItems(items, state.inputValue, value)

    if (!focusedItemIndex) {
      return updateFocusedItem(newState, props)
    }
  }

  return newState
}
