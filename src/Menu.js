// @flow

import * as React from 'react'
import cx from 'classnames'
import DefaultMenu from './DefaultMenu'
import type {
  ClassMap,
  Item as ItemType,
  ItemRenderer,
  MenuRenderer,
  LoadingState,
} from './types'

type Props = {
  classes: ClassMap,
  controlsId: string,
  focusedItemIndex: ?number,
  getItemId: (i: number) => string,
  inputValue: string,
  isItemSelected: (item: ItemType) => boolean,
  isOpen: boolean,
  itemKey: string,
  items: Array<ItemType>,
  loadingIndicator?: React.Node,
  onHoverItem: (i: number) => mixed,
  onSelect: (item: ItemType) => mixed,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  focusedItemRef: (ref: ?HTMLElement) => mixed,
  menuRef: (ref: ?HTMLElement) => mixed,
  state?: LoadingState,
}

class Menu extends React.Component<Props> {
  renderItems = () => {
    const {
      classes,
      focusedItemIndex,
      getItemId,
      inputValue,
      isItemSelected,
      itemKey,
      items,
      onHoverItem,
      onSelect,
      renderItem,
      focusedItemRef,
    } = this.props

    return items.map((item, i) => {
      const isSelected = isItemSelected(item)
      const isFocused =
        typeof focusedItemIndex === 'number' && i === focusedItemIndex

      const renderedItem = renderItem({
        inputValue,
        isFocused,
        isSelected,
        item,
      })

      const itemClasses = cx(classes.item, renderedItem.props.className, {
        [classes.focused]: isFocused,
        [classes.selected]: isSelected,
      })

      return React.cloneElement(renderedItem, {
        'aria-selected': isFocused,
        className: itemClasses,
        id: getItemId(i),
        key: item[itemKey],
        onClick: e => {
          if (renderedItem.props.onClick) {
            renderedItem.props.onClick(e)
          }

          onSelect(item)
        },
        onMouseEnter: () => onHoverItem(i),
        ref: isFocused ? focusedItemRef : null,
        role: 'option',
      })
    })
  }

  render() {
    const {
      classes,
      controlsId,
      inputValue,
      isOpen,
      loadingIndicator,
      renderMenu = DefaultMenu,
      menuRef,
      state = 'success',
    } = this.props

    const menu = renderMenu({
      children: this.renderItems(),
      className: classes.menu,
      listProps: {
        id: controlsId,
        role: 'listbox',
      },
      inputValue,
      isOpen,
      loadingIndicator,
      menuRef,
      state,
    })

    if (!menu) {
      return menu
    }

    if (menu.type === 'string') {
      return React.cloneElement(React.Children.only(menu), {
        ref: menuRef,
      })
    }

    return menu
  }
}

export default Menu
