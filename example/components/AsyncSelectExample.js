// @flow

import * as React from 'react'
import debounce from 'lodash/debounce'
import Spinner from './Spinner'
import { AsyncSelect, type InputRenderer, type ItemRenderer } from '../../src'

type Item = {
  avatar_url: string,
  id: string,
  login: string,
  url: string,
}

type State = {
  disabled: boolean,
  value: ?Item,
}

const defaultAvatar =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm'

class AsyncSelectExample extends React.Component<{}, State> {
  state = {
    disabled: false,
    value: null,
  }

  onChange = (selectedItem: ?Item) => {
    this.setState({ value: selectedItem })
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

  renderAvatar = (avatarUrl: string) => {
    return <img alt="" className="avatar" src={avatarUrl} />
  }

  renderItem: ItemRenderer = props => {
    return (
      <li>
        {this.renderAvatar(props.item.avatar_url)}
        <span>{props.item.login}</span>
      </li>
    )
  }

  renderInput: InputRenderer = ({ input, inputValue, value }) => {
    let avatar = null

    if (value) {
      avatar = this.renderAvatar(
        value.login === inputValue ? value.avatar_url : defaultAvatar
      )
    }

    let classes = 'custom-input'
    if (avatar) {
      classes += ' with-avatar'
    }

    return (
      <div className={classes}>
        {avatar}
        {input}
      </div>
    )
  }

  render() {
    const { disabled, value } = this.state

    return (
      <div className="async-select">
        <h2>{'Single Select (async)'}</h2>
        <AsyncSelect
          disabled={disabled}
          getInputValue={item => (item ? item.login : '')}
          itemKey="id"
          loadItems={this.loadItems}
          loadingIndicator={<Spinner />}
          minimumInput={1}
          onChange={this.onChange}
          placeholder="Search GitHub Users"
          renderInput={this.renderInput}
          renderItem={this.renderItem}
          value={value}
        />
      </div>
    )
  }
}

export default AsyncSelectExample
