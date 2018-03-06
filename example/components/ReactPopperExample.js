// @flow

import * as React from 'react'
import debounce from 'lodash/debounce'
import { Manager, Target, Popper } from 'react-popper'
import Portal from 'react-travel'
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

class ReactPopperExample extends React.Component<{}, State> {
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

    let popoverClasses = 'popover select-menu custom-menu'
    if (isOpen) {
      popoverClasses += ' is-open'
    }

    return (
      <Portal>
        <Popper className={popoverClasses} placement="bottom">
          {({ popperProps, restProps }) => {
            const setMenuRef = (ref: ?HTMLElement) => {
              menuRef(ref)
              popperProps.ref(ref)
            }

            return (
              <div {...popperProps} {...restProps} ref={setMenuRef}>
                {content}
              </div>
            )
          }}
        </Popper>
      </Portal>
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
        <h2>{'Multi Select (async) using React Popper'}</h2>
        <div className="toggles">
          <label htmlFor="open-menu-popper">
            <input
              checked={holdOpen}
              id="open-menu-popper"
              name="open-menu-popper"
              onChange={this.toggleOpen}
              type="checkbox"
            />
            {'Hold Open'}
          </label>
          <label htmlFor="loading-popper">
            <input
              checked={holdLoading}
              id="loading-popper"
              name="loading-popper"
              onChange={this.toggleLoading}
              type="checkbox"
            />
            {'Hold Loading'}
          </label>
        </div>
        <Manager>
          <Target>
            {({ targetProps }) => (
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
                rootRef={targetProps.ref}
                value={value}
                {...configurableProps}
              />
            )}
          </Target>
        </Manager>
      </div>
    )
  }
}

export default ReactPopperExample
