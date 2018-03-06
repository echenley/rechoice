// @flow

import * as React from 'react'
import Async from './Async'
import MultiSelect from './MultiSelect'
import type {
  FilterItemsMulti,
  LoadItems,
  Item,
  LoadingState,
  ItemRenderer,
  MenuRenderer,
  TagRenderer,
} from './types'

type Props = {
  disabled?: boolean,
  filterItems?: FilterItemsMulti,
  itemKey: string,
  loadingIndicator?: React.Node,
  loadingState?: LoadingState,
  loadItems: LoadItems,
  minimumInput?: number,
  onBlur?: () => mixed,
  onChange: (value: Array<Item>) => mixed,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
  placeholder?: string,
  renderItem: ItemRenderer,
  renderMenu?: MenuRenderer,
  renderTag: TagRenderer,
  value: Array<Item>,
}

const AsyncMultiSelect = ({
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
      {asyncProps => <MultiSelect {...props} {...asyncProps} />}
    </Async>
  )
}

export default AsyncMultiSelect
