// @flow

import * as React from 'react'
import { MultiSelect, type ItemRenderer, type TagRenderer } from '../../src'
import cities from '../data/cities'
import { highlightText } from '../util'

type Item = { name: string }

type State = {
  disabled: boolean,
  holdOpen: boolean,
  shouldFilterSelected: boolean,
  value: Array<Item>,
}

class MultiSelectExample extends React.Component<{}, State> {
  state = {
    disabled: false,
    holdOpen: false,
    shouldFilterSelected: true,
    value: [],
  }

  onChange = (value: Array<Item>) => {
    this.setState({ value })
  }

  toggleFilterSelected = () => {
    this.setState(state => ({
      shouldFilterSelected: !state.shouldFilterSelected,
    }))
  }

  toggleOpen = () => {
    this.setState(state => ({
      holdOpen: !state.holdOpen,
    }))
  }

  filterItems = (
    items: Array<Item>,
    inputValue: string,
    value: Array<Item>
  ) => {
    const { shouldFilterSelected } = this.state

    if (!shouldFilterSelected && !inputValue) {
      return items
    }

    const lowercaseInputValue = inputValue.toLowerCase()

    return items.filter(item => {
      if (item.name.toLowerCase().indexOf(lowercaseInputValue) === -1) {
        return false
      }

      if (
        shouldFilterSelected &&
        value.find(selectedItem => selectedItem.name === item.name)
      ) {
        return false
      }

      return true
    })
  }

  renderItem: ItemRenderer = props => {
    const text = highlightText(props.item.name, props.inputValue)

    return (
      <li>
        <span aria-hidden="true">{text}</span>
        <span className="sr-only">{props.item.name}</span>
        {props.isSelected ? ' \u2714' : null}
      </li>
    )
  }

  renderTag: TagRenderer = props => {
    return (
      <span className="tag">
        {props.item.name}
        <button onClick={props.removeTag}>{'\u00d7'}</button>
      </span>
    )
  }

  render() {
    const { disabled, holdOpen, shouldFilterSelected, value } = this.state

    return (
      <div className="multi">
        <h2>{'Multi Select'}</h2>
        <div className="toggles">
          <label htmlFor="filter-selected">
            <input
              checked={shouldFilterSelected}
              id="filter-selected"
              name="filter-selected"
              onChange={this.toggleFilterSelected}
              type="checkbox"
            />
            {'Filter out selected items'}
          </label>
          <label htmlFor="open-menu-default">
            <input
              checked={holdOpen}
              id="open-menu-default"
              name="open-menu-default"
              onChange={this.toggleOpen}
              type="checkbox"
            />
            {'Hold Open'}
          </label>
        </div>
        <MultiSelect
          disabled={disabled}
          filterItems={this.filterItems}
          isOpen={holdOpen ? true : undefined}
          itemKey="name"
          items={cities}
          onChange={this.onChange}
          placeholder="Select a City"
          renderItem={this.renderItem}
          renderTag={this.renderTag}
          value={value}
        />
      </div>
    )
  }
}

export default MultiSelectExample
