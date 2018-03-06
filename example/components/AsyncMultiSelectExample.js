// @flow

import * as React from 'react'
import debounce from 'lodash/debounce'
import {
  AsyncMultiSelect,
  type ItemRenderer,
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
  value: Array<Item>,
}

class AsyncMultiSelectExample extends React.Component<{}, State> {
  state = {
    disabled: false,
    value: [],
  }

  onChange = (value: Array<Item>) => {
    this.setState({ value })
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

  renderItem: ItemRenderer = ({ item }) => {
    return (
      <li>
        {this.renderAvatar(item)}
        <span>{item.login}</span>
      </li>
    )
  }

  renderTag: TagRenderer = ({ item, removeTag }) => {
    return (
      <div className="tag">
        {this.renderAvatar(item)}
        <span>{item.login}</span>
        <button onClick={removeTag}>{'\u00d7'}</button>
      </div>
    )
  }

  render() {
    const { disabled, value } = this.state

    return (
      <div className="async-select">
        <h2>{'Multi Select (async)'}</h2>
        <AsyncMultiSelect
          disabled={disabled}
          itemKey="id"
          loadItems={this.loadItems}
          loadingIndicator={<Spinner />}
          minimumInput={1}
          onChange={this.onChange}
          placeholder="Search GitHub Users"
          renderItem={this.renderItem}
          renderTag={this.renderTag}
          value={value}
        />
      </div>
    )
  }
}

export default AsyncMultiSelectExample
