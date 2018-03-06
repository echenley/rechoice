// @flow

import * as React from 'react'
import cx from 'classnames'
import Menu from '../Menu'
import contains from '../util/contains'
import { addClickListener, removeClickListener } from '../util/clickListener'
import keyCodes from '../util/keyCodes'
import generateId from '../util/generateId'
import getClasses from '../util/getClasses'
import scrollIntoView from '../util/scrollIntoView'
import {
  focusInput,
  focusPreviousItem,
  focusNextItem,
  updateInputValue,
} from '../util/state'
import Tags from './Tags'
import type {
  ClassMap,
  FilterItemsMulti,
  Item,
  ItemRenderer,
  MenuRenderer,
  LoadingState,
  TagRenderer,
} from '../types'

type Props = {
  classes?: $Shape<ClassMap>,
  disabled: boolean,
  filterItems: FilterItemsMulti,
  inputRef?: (ref: ?HTMLInputElement) => mixed,
  isOpen?: boolean,
  itemKey: string,
  items: Array<Item>,
  loadingIndicator?: React.Node,
  loadingState?: LoadingState,
  minimumInput: number,
  onBlur?: () => mixed,
  onChange: (value: Array<Item>) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  renderTag: TagRenderer,
  rootRef?: (ref: ?HTMLElement) => mixed,
  value: Array<Item>,
}

type State = {
  filteredItems: Array<Item>,
  focusedItemIndex: ?number,
  inputValue: string,
  isFocused: boolean,
  isOpen: boolean,
}

class MultiSelect extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    filterItems: (items: Array<Item>) => items,
    minimumInput: 0,
  }

  constructor(props: Props, ...args: Array<Object>) {
    super(props, ...args)

    this.state = {
      filteredItems: props.items,
      focusedItemIndex: null,
      inputValue: '',
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
  inputMirrorNode: ?HTMLElement
  inputNode: ?HTMLInputElement
  menuNode: ?HTMLElement
  rootNode: ?HTMLElement

  id: string
  controlsId: string
  classes: ClassMap

  componentDidMount() {
    addClickListener(this.onDocumentClick)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.items !== this.props.items ||
      nextProps.value !== this.props.value
    ) {
      this.setState(state => ({
        filteredItems: nextProps.filterItems(
          nextProps.items,
          state.inputValue,
          nextProps.value
        ),
      }))
    }
  }

  componentDidUpdate() {
    const { inputNode, inputMirrorNode } = this

    if (!inputNode || !inputMirrorNode) {
      return
    }

    inputNode.style.width = ''
    inputNode.style.width = `${inputMirrorNode.clientWidth}px`
  }

  componentWillUnmount() {
    removeClickListener(this.onDocumentClick)
    this.clearBlurTimer()
  }

  setInputRef = (ref: ?HTMLInputElement) => {
    if (this.props.inputRef) {
      this.props.inputRef(ref)
    }

    this.inputNode = ref
  }

  setFocusedItemRef = (ref: ?HTMLElement) => {
    this.focusedItemNode = ref
  }

  setInputMirrorRef = (ref: ?HTMLElement) => {
    this.inputMirrorNode = ref
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
    this.setState({
      isOpen: false,
      isFocused: false,
      focusedItemIndex: null,
    })
  }

  focusInput = () => {
    const { inputNode } = this
    if (inputNode) {
      inputNode.blur()
      inputNode.focus()
    }
  }

  clearBlurTimer = () => {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer)
      this.blurTimer = null
    }
  }

  onDocumentClick = (e: Event) => {
    const { target } = e
    const { rootNode, menuNode } = this

    if (target instanceof Node && rootNode && menuNode) {
      if (!contains(rootNode, target) && !contains(menuNode, target)) {
        // close menu when clicking outside
        this.close()
      } else {
        // stop menu click from blurring the input
        e.preventDefault()
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

  onInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (this.props.onInputChange) {
      this.props.onInputChange(inputValue)
    }

    this.setState(state => updateInputValue(state, this.props, inputValue))
  }

  onKeyDown = (e: SyntheticKeyboardEvent<>) => {
    const {
      filteredItems,
      focusedItemIndex,
      inputValue,
      isFocused,
    } = this.state
    const { filterItems, loadingState, onChange, items, value } = this.props

    if (e.keyCode === keyCodes.BACKSPACE && !inputValue) {
      const newValue = value.slice(0, -1)
      onChange(newValue)
      this.setState(state => ({
        filteredItems: filterItems(items, state.inputValue, newValue),
      }))
    } else if (e.keyCode === keyCodes.ENTER) {
      if (loadingState === 'loading') {
        e.preventDefault()
        return
      }

      if (
        typeof focusedItemIndex === 'number' &&
        isFocused &&
        this.getIsOpen()
      ) {
        this.toggleItem(filteredItems[focusedItemIndex])
      } else {
        this.setState(state => ({
          isOpen: true,
          filteredItems: filterItems(items, state.inputValue, value),
        }))
      }
    } else if (e.keyCode === keyCodes.UP) {
      this.focusPreviousItem()
    } else if (e.keyCode === keyCodes.DOWN) {
      this.focusNextItem()
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

  toggleItem = (item: ?Item) => {
    if (!item) {
      return
    }

    const { onChange, itemKey, value } = this.props
    const itemId = item[itemKey]
    const itemIndex = value.findIndex(o => o[itemKey] === itemId)

    const newValue =
      itemIndex === -1
        ? [...value, item]
        : value.filter((o, i) => i !== itemIndex)

    onChange(newValue)

    this.setState(
      {
        inputValue: '',
        isOpen: false,
      },
      this.focusInput
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
    return Boolean(
      value.find(selectedItem => selectedItem[itemKey] === item[itemKey])
    )
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
      disabled,
      loadingIndicator,
      itemKey,
      loadingState,
      placeholder,
      renderItem,
      renderMenu,
      renderTag,
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

    const inputMirrorText = value.length
      ? inputValue
      : inputValue || placeholder

    const focusedItemId =
      typeof focusedItemIndex === 'number'
        ? this.getItemId(focusedItemIndex)
        : null

    return (
      <div className={selectClasses}>
        <div
          className={this.classes.inputWrapper}
          onClick={this.focusInput}
          ref={this.setRootNode}
          role="presentation"
        >
          <Tags
            className={this.classes.tags}
            itemKey={itemKey}
            removeTag={this.toggleItem}
            renderTag={renderTag}
            value={value}
          />
          <input
            aria-activedescendant={focusedItemId}
            aria-autocomplete="list"
            aria-owns={this.controlsId}
            autoComplete="off"
            className={this.classes.input}
            disabled={disabled}
            onBlur={this.onInputBlur}
            onChange={this.onInputChange}
            onFocus={this.onInputFocus}
            onKeyDown={this.onKeyDown}
            placeholder={value.length ? null : placeholder}
            ref={this.setInputRef}
            type="text"
            value={inputValue}
          />
          <span
            className={this.classes.inputMirror}
            ref={this.setInputMirrorRef}
          >
            {inputMirrorText}{' '}
          </span>
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
          onSelect={this.toggleItem}
          renderItem={renderItem}
          renderMenu={renderMenu}
          state={loadingState}
        />
      </div>
    )
  }
}

export default MultiSelect
