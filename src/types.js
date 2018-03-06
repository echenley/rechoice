// @flow

import * as React from 'react'

export type FilterItems<Value> = (
  items: Array<Item>,
  inputValue: string,
  value: Value
) => Array<Item>

export type FilterItemsSingle = FilterItems<?Item>
export type FilterItemsMulti = FilterItems<Array<Item>>

export type LoadItemsData = {
  items: Array<Item>,
  complete?: boolean,
}

export type LoadItemsCallback = (err: ?Object, data: LoadItemsData) => mixed

export type LoadItems = (
  inputValue: string,
  cb: LoadItemsCallback
) => void | Promise<LoadItemsData | Object>

export type LoadingState = 'loading' | 'error' | 'success'
export type Item = Object

export type ClassMap = {
  disabled: string,
  focused: string,
  input: string,
  inputMirror: string,
  inputWrapper: string,
  item: string,
  menu: string,
  root: string,
  selected: string,
  tags: string,
  value: string,
}

type MenuRendererProps = {
  children: React.Node,
  className: string,
  inputValue: string,
  isOpen: boolean,
  listProps: {
    id: string,
    role: string,
  },
  loadingIndicator?: React.Node,
  menuRef: (ref: ?HTMLElement) => mixed,
  state: LoadingState,
}

type InputRendererProps = {
  input: React.ChildrenArray<React.Node>,
  inputValue: string,
  value: ?Item,
}

type ItemRendererProps = {
  inputValue: string,
  isFocused: boolean,
  isSelected: boolean,
  item: Item,
}

type TagRendererProps = {
  item: Item,
  removeTag: () => mixed,
}

export type InputRenderer = (props: InputRendererProps) => React.Node
export type MenuRenderer = (props: MenuRendererProps) => ?React.Element<any>
export type ItemRenderer = (props: ItemRendererProps) => React.Element<any>
export type TagRenderer = (props: TagRendererProps) => React.Element<any>
