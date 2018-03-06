// @flow

import * as React from 'react'
import cx from 'classnames'
import Menu from './Menu'
import contains from './util/contains'
import { addClickListener, removeClickListener } from './util/clickListener'
import keyCodes from './util/keyCodes'
import generateId from './util/generateId'
import getClasses from './util/getClasses'
import scrollIntoView from './util/scrollIntoView'
import {
  focusInput,
  focusPreviousItem,
  focusNextItem,
  updateInputValue,
} from './util/state'
import type {
  ClassMap,
  FilterItemsSingle,
  InputRenderer,
  Item,
  ItemRenderer,
  MenuRenderer,
  LoadingState,
} from './types'

type Props = {
  autoResizeInput: boolean,
  classes?: $Shape<ClassMap>,
  disabled: boolean,
  filterItems: FilterItemsSingle,
  getInputValue: (item: ?Item) => string,
  inputRef?: (ref: ?HTMLInputElement) => mixed,
  isOpen?: boolean,
  itemKey: string,
  items: Array<Item>,
  loadingIndicator?: React.Node,
  loadingState?: LoadingState,
  minimumInput: number,
  onBlur?: () => mixed,
  onChange: (item: ?Item) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderInput?: InputRenderer,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  resetInputOnBlur?: boolean,
  rootRef?: (ref: ?HTMLElement) => mixed,
  value: ?Item,
}

type State = {
  filteredItems: Array<Item>,
  focusedItemIndex: ?number,
  inputValue: string,
  isFocused: boolean,
  isOpen: boolean,
}

class Select extends React.Component<Props, State> {
  static defaultProps = {
    autoResizeInput: false,
    resetInputOnBlur: true,
    disabled: false,
    filterItems: (items: Array<Item>) => items,
    minimumInput: 0,
  }

  constructor(props: Props, ...args: Array<Object>) {
    super(props, ...args)

    this.state = {
      filteredItems: props.items,
      focusedItemIndex: null,
      inputValue: props.value ? props.getInputValue(props.value) : '',
      isFocused: false,
      isOpen: false,
    }

    const id = generateId('rechoice')

    this.id = id
    this.controlsId = `${id}-listbox`
    this.classes = getClasses(props.classes)
  }

  blurTimer: ?TimeoutID
  focusedItemNode: ?HTMLElement
  inputNode: ?HTMLInputElement
  inputMirrorNode: ?HTMLElement
  menuNode: ?HTMLElement
  rootNode: ?HTMLElement

  id: string
  controlsId: string
  classes: ClassMap

  componentDidMount() {
    addClickListener(this.onDocumentClick)
  }

  componentWillReceiveProps(nextProps: Props) {
    const { filterItems, items } = nextProps

    if (items !== this.props.items) {
      this.setState(state => ({
        filteredItems: filterItems(items, state.inputValue, nextProps.value),
      }))
    }
  }

  componentDidUpdate() {
    const { inputNode, inputMirrorNode } = this
    const { autoResizeInput } = this.props

    if (!autoResizeInput || !inputNode || !inputMirrorNode) {
      return
    }

    inputNode.style.width = ''
    inputNode.style.width = `${inputMirrorNode.clientWidth}px`
  }

  componentWillUnmount() {
    removeClickListener(this.onDocumentClick)
    this.clearBlurTimer()
  }

  setFocusedItemRef = (ref: ?HTMLElement) => {
    this.focusedItemNode = ref
  }

  setInputMirrorRef = (ref: ?HTMLElement) => {
    this.inputMirrorNode = ref
  }

  setInputRef = (ref: ?HTMLInputElement) => {
    if (this.props.inputRef) {
      this.props.inputRef(ref)
    }

    this.inputNode = ref
  }

  setRootNode = (ref: ?HTMLElement) => {
    if (this.props.rootRef) {
      this.props.rootRef(ref)
    }

    this.rootNode = ref
  }

  setMenuRef = (ref: ?HTMLElement) => {
    this.menuNode = ref
  }

  close = () => {
    this.setState(state => {
      const {
        resetInputOnBlur,
        getInputValue,
        items,
        onInputChange,
        value,
      } = this.props

      const newState: $Shape<State> = {
        isOpen: false,
        isFocused: false,
      }

      if (resetInputOnBlur) {
        newState.inputValue = getInputValue(value)

        if (onInputChange && state.inputValue !== newState.inputValue) {
          onInputChange(newState.inputValue)
        }
      }

      if (value) {
        newState.filteredItems = items
      }

      return newState
    })
  }

  focusInput = () => {
    if (this.inputNode) {
      this.inputNode.focus()
    }
  }

  clearBlurTimer = () => {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer)
      this.blurTimer = null
    }
  }

  onDocumentClick = (e: Event) => {
    const target = e.target
    const { rootNode, menuNode } = this

    if (target instanceof Node && rootNode && menuNode) {
      const isInRootNode = contains(rootNode, target)
      const isInMenu = contains(menuNode, target)
      if (isInMenu) {
        // stop menu click from blurring the input
        e.preventDefault()
      } else if (!isInRootNode && !isInMenu) {
        // close menu when clicking outside
        this.close()
      }
    }
  }

  onInputBlur = () => {
    this.clearBlurTimer()
    if (this.props.onBlur) {
      this.props.onBlur()
    }
    this.blurTimer = setTimeout(this.close, 10)
  }

  onInputFocus = () => {
    this.clearBlurTimer()
    if (this.props.onFocus) {
      this.props.onFocus()
    }
    this.setState(state => focusInput(state, this.props), this.scrollToSelected)
  }

  onKeyDown = (e: SyntheticKeyboardEvent<>) => {
    const {
      filteredItems,
      focusedItemIndex,
      inputValue,
      isFocused,
    } = this.state

    const {
      filterItems,
      loadingState,
      minimumInput,
      items,
      onChange,
      value,
    } = this.props

    if (e.keyCode === keyCodes.ENTER) {
      if (loadingState === 'loading') {
        e.preventDefault()
        return
      }

      if (
        typeof focusedItemIndex === 'number' &&
        isFocused &&
        this.getIsOpen()
      ) {
        this.onSelect(filteredItems[focusedItemIndex])
      } else if (inputValue.length >= minimumInput) {
        this.setState(state => ({
          isOpen: true,
          filteredItems: filterItems(items, state.inputValue, value),
        }))
      }
    } else if (e.keyCode === keyCodes.UP) {
      this.focusPreviousItem()
    } else if (e.keyCode === keyCodes.DOWN) {
      this.focusNextItem()
    } else if (
      value &&
      !inputValue &&
      (e.keyCode === keyCodes.BACKSPACE || e.keyCode === keyCodes.DELETE)
    ) {
      onChange(null)
    } else {
      return
    }

    e.preventDefault()
  }

  onHoverItem = (i: number) => {
    this.setState({
      focusedItemIndex: i,
    })
  }

  onSelect = (item: ?Item) => {
    if (!item) {
      return
    }

    const {
      onChange,
      onInputChange,
      getInputValue,
      filterItems,
      items,
    } = this.props

    onChange(item)

    const inputValue = getInputValue(item)

    if (onInputChange) {
      onInputChange(inputValue)
    }

    this.setState(
      {
        inputValue,
        isOpen: false,
        filteredItems: filterItems(items, inputValue, item),
      },
      this.focusInput
    )
  }

  onInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (this.props.onInputChange) {
      this.props.onInputChange(inputValue)
    }

    this.setState(
      state => updateInputValue(state, this.props, inputValue),
      this.scrollToSelected
    )
  }

  focusPreviousItem() {
    this.setState(
      state => focusPreviousItem(state, this.props),
      this.scrollToSelected
    )
  }

  focusNextItem() {
    this.setState(
      state => focusNextItem(state, this.props),
      this.scrollToSelected
    )
  }

  scrollToSelected = () => {
    const { focusedItemNode, menuNode } = this

    if (!menuNode || !focusedItemNode) {
      return
    }

    scrollIntoView(focusedItemNode, menuNode)
  }

  isItemSelected = (item: Item) => {
    const { value, itemKey } = this.props
    return Boolean(value && value[itemKey] === item[itemKey])
  }

  getItemId = (index: number) => {
    return `${this.id}-item-${index}`
  }

  getIsOpen = () => {
    return typeof this.props.isOpen === 'undefined'
      ? this.state.isOpen
      : this.props.isOpen
  }

  render() {
    const {
      autoResizeInput,
      disabled,
      loadingIndicator,
      placeholder,
      itemKey,
      loadingState,
      renderInput,
      renderItem,
      renderMenu,
      value,
    } = this.props

    const {
      filteredItems,
      focusedItemIndex,
      inputValue,
      isFocused,
    } = this.state

    const selectClasses = cx(this.classes.root, {
      [this.classes.focused]: isFocused,
      [this.classes.disabled]: disabled,
    })

    const isOpen = this.getIsOpen()
    const focusedItemId =
      typeof focusedItemIndex === 'number'
        ? this.getItemId(focusedItemIndex)
        : null

    let inputMirror = null

    if (autoResizeInput) {
      inputMirror = (
        <span className={this.classes.inputMirror} ref={this.setInputMirrorRef}>
          {inputValue || placeholder}{' '}
        </span>
      )
    }

    let input = (
      <input
        aria-activedescendant={focusedItemId}
        aria-autocomplete="list"
        aria-owns={this.controlsId}
        autoComplete="off"
        className={this.classes.input}
        disabled={disabled}
        key="rechoice-input"
        onBlur={this.onInputBlur}
        onChange={this.onInputChange}
        onFocus={this.onInputFocus}
        onKeyDown={this.onKeyDown}
        placeholder={inputValue ? null : placeholder}
        ref={this.setInputRef}
        type="text"
        value={inputValue}
      />
    )

    if (renderInput) {
      input = renderInput({
        input,
        inputMirror,
        inputValue,
        value,
      })
    }

    return (
      <div className={selectClasses}>
        <div
          className={this.classes.inputWrapper}
          onClick={this.focusInput}
          ref={this.setRootNode}
          role="presentation"
        >
          {input}
        </div>
        <Menu
          classes={this.classes}
          controlsId={this.controlsId}
          focusedItemIndex={focusedItemIndex}
          focusedItemRef={this.setFocusedItemRef}
          getItemId={this.getItemId}
          inputValue={inputValue}
          isItemSelected={this.isItemSelected}
          isOpen={isOpen}
          itemKey={itemKey}
          items={filteredItems}
          loadingIndicator={loadingIndicator}
          menuRef={this.setMenuRef}
          onHoverItem={this.onHoverItem}
          onSelect={this.onSelect}
          renderItem={renderItem}
          renderMenu={renderMenu}
          state={loadingState}
        />
      </div>
    )
  }
}

export default Select
