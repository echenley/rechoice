// @flow

import * as React from 'react'
import type { Item, TagRenderer } from '../types'

type Props = {
  className: string,
  itemKey: string,
  removeTag: (item: Item) => mixed,
  renderTag: TagRenderer,
  value: Array<Item>,
}

class Tags extends React.Component<Props> {
  renderTag = (item: Item) => {
    const { itemKey, removeTag, renderTag } = this.props

    const tag = renderTag({
      item,
      removeTag: () => removeTag(item),
    })

    return React.cloneElement(tag, {
      key: item[itemKey],
    })
  }

  render() {
    const { className, value } = this.props
    return <span className={className}>{value.map(this.renderTag)}</span>
  }
}

export default Tags
