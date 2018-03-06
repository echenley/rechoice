// @flow

import * as React from 'react'
import type { MenuRenderer } from './types'

const Menu: MenuRenderer = ({
  children,
  className,
  isOpen,
  listProps,
  loadingIndicator,
  menuRef,
  state,
}) => {
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
    <div className={className} ref={menuRef}>
      {content}
    </div>
  )
}

export default Menu
