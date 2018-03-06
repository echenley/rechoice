// @flow

import * as React from 'react'
import Async from './Async'
import Select from './Select'
import type {
  FilterItemsSingle,
  LoadItems,
  Item,
  LoadingState,
  ItemRenderer,
  MenuRenderer,
} from './types'

type Props = {
  disabled?: boolean,
  filterItems?: FilterItemsSingle,
  getInputValue: (item: ?Item) => string,
  itemKey: string,
  loadingIndicator?: React.Node,
  loadingState?: LoadingState,
  loadItems: LoadItems,
  minimumInput?: number,
  onBlur?: () => mixed,
  onChange: (item: ?Item) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  value: ?Item,
}

const AsyncSelect = ({
  loadItems,
  onChange,
  onFocus,
  onInputChange,
  ...props
}: Props) => {
  return (
    <Async
      loadItems={loadItems}
      minimumInput={props.minimumInput}
      onChange={onChange}
      onFocus={onFocus}
      onInputChange={onInputChange}
    >
      {asyncProps => <Select {...props} {...asyncProps} />}
    </Async>
  )
}

export default AsyncSelect
