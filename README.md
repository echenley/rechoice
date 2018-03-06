[![Build Status](https://travis-ci.org/echenley/rechoice.svg?branch=master)](https://travis-ci.org/echenley/rechoice)

# Rechoice and be Glad

A highly customizable select dropdown for React.

## Reasoning

Rechoice is intended to be a more accessible and customizable version of [react-select](https://github.com/JedWatson/react-select/).

## Components

* [Select](#select)
* [MultiSelect](#multiselect)
* [AsyncSelect](#asyncselect)
* [AsyncMultiSelect](#asyncmultiselect)

### Select

Single-value select component.

| Prop                   | Default              | Description                                      |
| ---------------------- | -------------------- | ------------------------------------------------ |
| `itemKey`              |                      | Object property used to distinguish items.       |
| `items`                | `[]`                 | Array of objects to render in the menu.          |
| `loadingIndicator`     | `'Loading results…'` | React Node to render when loading                |
| `minimumInput`         | `0`                  | Minimum length of input before opening the menu. |
| `renderSelected`       |                      | [See below.](#renderselected)                    |
| `value`                | `null`               | One of the possible menu items.                  |
| [Common Props](#props) |                      |

```js
type SelectProps = {
  disabled?: boolean,
  filterItems?: (
    items: Array<Object>,
    inputValue: string,
    value: Object
  ) => Array<Object>,
  itemKey: string,
  items: Array<Object>,
  loadingIndicator?: React.Node,
  loadingState?: 'success' | 'error' | 'loading',
  minimumInput?: number,
  onBlur?: () => mixed,
  onChange: (item: Object) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  renderSelected: SelectedRenderer,
  value: ?Object,
}
```

### MultiSelect

Select component allowing multiple values to be selected. Renders tags for selected values.

| Prop                   | Default              | Description                                      |
| ---------------------- | -------------------- | ------------------------------------------------ |
| `itemKey`              |                      | Object property used to distinguish items.       |
| `loadingIndicator`     | `'Loading results…'` | React Node to render when loading                |
| `loadItems`            |                      | [See below.](#loaditems)                         |
| `minimumInput`         | `0`                  | Minimum length of input before opening the menu. |
| `renderTag`            |                      | [See below.](#rendertag)                         |
| `value`                | `null`               | An array of possible menu items.                 |
| [Common Props](#props) |                      |

```js
type MultiSelectProps = {
  disabled?: boolean,
  filterItems?: (
    items: Array<Object>,
    inputValue: string,
    value: Array<Object>
  ) => Array<Object>,
  itemKey: string,
  items: Array<Object>,
  loadingIndicator?: React.Node,
  loadingState?: 'success' | 'error' | 'loading',
  minimumInput?: number,
  onBlur?: () => mixed,
  onChange: (value: Array<Object>) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  renderTag: TagRenderer,
  value: Array<Object>,
}
```

### AsyncSelect

Use when menu items are unknown at mount or are fetched and refined as the user types.

| Prop                   | Default              | Description                                      |
| ---------------------- | -------------------- | ------------------------------------------------ |
| `itemKey`              |                      | Object property used to distinguish items.       |
| `loadingIndicator`     | `'Loading results…'` | React Node to render when loading                |
| `loadItems`            |                      | [See below.](#loaditems)                         |
| `minimumInput`         | `0`                  | Minimum length of input before opening the menu. |
| `renderSelected`       |                      | [See below.](#renderselected)                    |
| `value`                | `null`               | One of the possible menu items.                  |
| [Common Props](#props) |                      |

```js
type Props = {
  disabled?: boolean,
  filterItems?: (
    items: Array<Object>,
    inputValue: string,
    value: Object
  ) => Array<Object>,
  itemKey: string,
  loadingIndicator?: React.Node,
  loadingState?: 'success' | 'error' | 'loading',
  loadItems: LoadItems,
  minimumInput?: number,
  onBlur?: () => mixed,
  onChange: (item: Object) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  renderTag?: TagRenderer,
  value: ?Object,
}
```

### AsyncMultiSelect

| Prop                   | Default              | Description                                      |
| ---------------------- | -------------------- | ------------------------------------------------ |
| `itemKey`              |                      | Object property used to distinguish items.       |
| `loadingIndicator`     | `'Loading results…'` | React Node to render when loading                |
| `loadItems`            |                      | [See below.](#loaditems)                         |
| `minimumInput`         | `0`                  | Minimum length of input before opening the menu. |
| `renderTag`            |                      | [See below.](#rendertag)                         |
| `value`                | `null`               | An array of possible menu items.                 |
| [Common Props](#props) |                      |

```js
type Props = {
  disabled?: boolean,
  filterItems?: (
    items: Array<Object>,
    inputValue: string,
    value: Array<Object>
  ) => Array<Object>,
  itemKey: string,
  loadingIndicator?: React.Node,
  loadingState?: 'success' | 'error' | 'loading',
  loadItems: LoadItems,
  minimumInput?: number,
  onBlur?: () => mixed,
  onChange: (items: Array<Object>) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  renderTag?: TagRenderer,
  value: Array<Object>,
}
```

## Props

### Shared Props

| Prop               | Default              | Description                                                                                                         |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `classes`          |                      | [See below.](#classes)                                                                                              |
| `disabled`         | `false`              | Adds a `disabled` class to the wrapper and disables the input                                                       |
| `filterItems`      | `(items) => items`   | Filter items based on inputValue and/or external state.                                                             |
| `itemKey`          |                      | Object property used to distinguish items.                                                                          |
| `loadingIndicator` | `'Loading results…'` | React Node to render when loading                                                                                   |
| `loadingState`     | `'success'`          | The menu's loading state (error/success/loading). Usually not necessary. Use to override the default loading state. |
| `minimumInput`     | `0`                  | Minimum length of input before opening the menu.                                                                    |
| `onBlur`           |                      | Function fired when input is blurred                                                                                |
| `onChange`         |                      | Function that receives the selected item or items.                                                                  |
| `onFocus`          |                      | Function fired when input is focused                                                                                |
| `onInputChange`    |                      | Function that receives the current input value                                                                      |
| `placeholder`      | `''`                 | What to render when the input is empty.                                                                             |
| `renderItem`       |                      | [See below.](#renderitem)                                                                                           |
| `renderMenu`       |                      | [See below.](#rendermenu)                                                                                           |

### classes

Override any or all of the default classes.

**Defaults**

```js
{
  disabled: 'disabled',
  focused: 'focused',
  input: 'rechoice-input',
  inputMirror: 'rechoice-input-mirror',
  inputWrapper: 'rechoice-input-wrapper',
  item: 'rechoice-item',
  root: 'rechoice',
  selected: 'selected',
  tags: 'rechoice-tags',
  value: 'rechoice-value',
}
```

### loadItems

Fetches items to display in the menu.

```js
// using a callback
function loadItems(inputValue, cb) {
  fetch(`https://api.github.com/search/users?q=${inputValue}`)
    .then(response => response.json())
    .then(json => cb(null, { items: json.items }), err => cb(err))
}

// using promises
function loadItems(inputValue) {
  return fetch(`https://api.github.com/search/users?q=${inputValue}`)
    .then(response => response.json())
    .then(json => ({ items: json.items }))
}
```

### renderItem

Renders a menu item.

```js
type Props = {
  inputValue: string,
  isFocused: boolean,
  isSelected: boolean,
  item: Object,
}

function renderItem(props: Props) {
  return <li>{props.item.name}</li>
}
```

### renderMenu

Used when the menu must be fully customized. Enables, for instance, rendering the menu in a popover or rendering a table instead of a list.

```js
type MenuProps = {
  children: Array<React.Node>,
  inputValue: string,
  isOpen: boolean,
  listProps: {
    id: string,
    role: 'listbox',
  },
  loadingIndicator?: React.Node,
  menuRef: (ref: ?HTMLElement) => mixed,
  state: 'success' | 'error' | 'loading',
}

function renderMenu = ({
  children,
  isOpen,
  listProps,
  loadingIndicator,
  menuRef,
  state,
}: MenuProps) => {
  if (!isOpen) {
    return null
  }

  let content = null

  if (state === 'loading') {
    const loader = loadingIndicator || 'Loading results…'
    content = <div className="loading">{loader}</div>
  } else if (state === 'error') {
    content = <div className="error">{'Something went wrong.'}</div>
  } else if (React.Children.count(children) === 0) {
    content = <div className="empty">{'No results.'}</div>
  } else {
    content = <ul {...listProps}>{children}</ul>
  }

  return (
    <div
      className="select-items"
      ref={menuRef}
    >
      {content}
    </div>
  )
}
```

### renderSelected

Renders the selected value. Can return anything renderable by React.

```js
function renderSelected(item: Object) {
  return item.name
}
```

### renderTag

Renders each value in a MultiSelect. Can return anything renderable by React.

```js
type TagProps = {
  item: Object,
  removeTag: () => mixed,
}

function renderTag({ item, removeTag }: TagProps) {
  return (
    <span className="tag">
      {props.item.name}
      <button onClick={props.removeTag}>{'×'}</button>
    </span>
  )
}
```

## Running Locally

```shell
git clone ssh://git@github.com:echenley/rechoice.git
cd rechoice
npm install
npm start

# or using yarn
yarn
yarn start
```
