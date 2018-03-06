// @flow

import * as React from 'react'
import { Select, type ItemRenderer } from '../../src'
import cities from '../data/cities'
import { highlightText } from '../util'

type ItemType = { name: string }

type State = {
  disabled: boolean,
  value: ?ItemType,
}

class SelectExample extends React.Component<{}, State> {
  state = {
    disabled: false,
    value: null,
  }

  onChange = (selectedItem: ?ItemType) => {
    this.setState({ value: selectedItem })
  }

  toggleDisabled = () => {
    this.setState(state => ({
      disabled: !state.disabled,
    }))
  }

  filterItems = (items: Array<ItemType>, inputValue: string) => {
    if (!inputValue) {
      return items
    }

    const lowercaseInputValue = inputValue.toLowerCase()

    return items.filter(
      item => item.name.toLowerCase().indexOf(lowercaseInputValue) !== -1
    )
  }

  renderItem: ItemRenderer = props => {
    const text = highlightText(props.item.name, props.inputValue)

    return (
      <li className="stuff" role="presentation">
        <span aria-hidden="true">{text}</span>
        <span className="sr-only">{props.item.name}</span>
        {props.isSelected ? ' \u2714' : null}
      </li>
    )
  }

  getInputValue = (item: ?ItemType) => (item ? item.name : '')

  render() {
    const { disabled, value } = this.state

    return (
      <div className="basic">
        <h2>{'Single Select'}</h2>
        <Select
          disabled={disabled}
          filterItems={this.filterItems}
          getInputValue={this.getInputValue}
          itemKey="name"
          items={cities}
          onChange={this.onChange}
          placeholder="Select a City"
          renderItem={this.renderItem}
          value={value}
        />
        <div className="toggles">
          <label htmlFor="disable-input">
            {'Disable:'}
            <input
              checked={disabled}
              id="disable-input"
              name="disable-input"
              onChange={this.toggleDisabled}
              type="checkbox"
            />
          </label>
        </div>
      </div>
    )
  }
}

export default SelectExample
