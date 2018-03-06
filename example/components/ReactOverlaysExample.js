// @flow

import * as React from 'react'
import debounce from 'lodash/debounce'
import Overlay from 'react-overlays/lib/Overlay'
import {
  AsyncMultiSelect,
  type ItemRenderer,
  type MenuRenderer,
  type TagRenderer,
} from '../../src'
import Spinner from './Spinner'

type Item = {
  avatar_url: string,
  id: string,
  login: string,
  url: string,
}

type State = {
  disabled: boolean,
  holdLoading: boolean,
  holdOpen: boolean,
  value: Array<Item>,
}

type MenuContentProps = {
  children: React.Node,
  menuRef: (ref: ?HTMLElement) => mixed,
  style?: Object,
}

const MenuContent = ({ children, menuRef, style }: MenuContentProps) => (
  <div className="select-menu custom-menu" ref={menuRef} style={style}>
    {children}
  </div>
)

class ReactOverlaysExample extends React.Component<{}, State> {
  state = {
    disabled: false,
    holdOpen: false,
    holdLoading: false,
    value: [],
  }

  onChange = (value: Array<Item>) => {
    this.setState({ value })
  }

  toggleOpen = () => {
    this.setState(state => ({
      holdOpen: !state.holdOpen,
    }))
  }

  toggleLoading = () => {
    this.setState(state => ({
      holdLoading: !state.holdLoading,
    }))
  }

  loadItems = debounce((inputValue: string, cb: Function) => {
    if (!inputValue) {
      return
    }

    fetch(`https://api.github.com/search/users?q=${inputValue}`)
      .then(response => response.json())
      .then(
        json => {
          cb(null, { items: json.items })
        },
        err => {
          cb(err)
        }
      )
  }, 500)

  setRootRef = (ref: ?HTMLElement) => {
    this.rootNode = ref
  }

  rootNode: ?HTMLElement

  renderAvatar = (item: Item) => {
    return <img alt="" className="avatar" src={item.avatar_url} />
  }

  renderItem: ItemRenderer = props => {
    return (
      <tr>
        <td>{this.renderAvatar(props.item)}</td>
        <td>{props.item.login}</td>
        <td>{props.item.id}</td>
      </tr>
    )
  }

  renderTag: TagRenderer = props => {
    return (
      <div className="tag" key={props.item.id}>
        {this.renderAvatar(props.item)}
        <span>{props.item.login}</span>
        <button onClick={props.removeTag}>{'\u00d7'}</button>
      </div>
    )
  }

  renderMenu: MenuRenderer = ({
    children,
    listProps,
    isOpen,
    menuRef,
    state,
  }) => {
    let content = null

    if (state === 'loading') {
      content = (
        <div className="loading">
          <Spinner />
        </div>
      )
    } else if (state === 'error') {
      content = <div className="error">{'Something went wrong.'}</div>
    } else if (React.Children.count(children) === 0) {
      content = <div className="empty">{'No results found.'}</div>
    } else {
      content = [
        <div className="custom-menu-header" key="header">
          <div />
          <div>{'Name'}</div>
          <div>{'ID'}</div>
        </div>,
        <div className="scroll" key="items">
          <table>
            <tbody {...listProps}>{children}</tbody>
          </table>
        </div>,
      ]
    }

    return (
      <Overlay
        animation={false}
        placement="bottom"
        show={isOpen}
        target={this.rootNode}
      >
        <MenuContent menuRef={menuRef}>{content}</MenuContent>
      </Overlay>
    )
  }

  render() {
    const { disabled, holdLoading, holdOpen, value } = this.state

    const configurableProps = {}

    if (holdOpen) {
      configurableProps.isOpen = true
    }

    if (holdLoading) {
      configurableProps.loadingState = 'loading'
    }

    return (
      <div className="async-select">
        <h2>{'Multi Select (async) using React Overlays'}</h2>
        <div className="toggles">
          <label htmlFor="open-menu-overlays">
            <input
              checked={holdOpen}
              id="open-menu-overlays"
              name="open-menu-overlays"
              onChange={this.toggleOpen}
              type="checkbox"
            />
            {'Hold Open'}
          </label>
          <label htmlFor="loading-overlays">
            <input
              checked={holdLoading}
              id="loading-overlays"
              name="loading-overlays"
              onChange={this.toggleLoading}
              type="checkbox"
            />
            {'Hold Loading'}
          </label>
        </div>
        <AsyncMultiSelect
          disabled={disabled}
          itemKey="id"
          loadItems={this.loadItems}
          minimumInput={1}
          onChange={this.onChange}
          placeholder="Search GitHub Users"
          renderItem={this.renderItem}
          renderMenu={this.renderMenu}
          renderTag={this.renderTag}
          rootRef={this.setRootRef}
          value={value}
          {...configurableProps}
        />
      </div>
    )
  }
}

export default ReactOverlaysExample
