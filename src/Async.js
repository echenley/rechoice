// @flow

import * as React from 'react'
import type {
  LoadItems,
  LoadItemsData,
  LoadItemsCallback,
  Item,
  LoadingState,
} from './types'

type State = {
  items: Array<Item>,
  loadingState: LoadingState,
}

type AsyncProps = State & {
  onChange: *,
  onInputChange?: (inputValue: string) => mixed,
}

type Props = {
  children: (props: AsyncProps) => React.Element<any>,
  loadItems: LoadItems,
  minimumInput: number,
  onChange: *,
  onFocus?: () => mixed,
  onInputChange?: (inputValue: string) => mixed,
}

class Async extends React.Component<Props, State> {
  static defaultProps = {
    minimumInput: 0,
  }

  state = {
    items: [],
    loadingState: 'success',
  }

  constructor(...args: Array<Object>) {
    super(...args)
    const self: Object = this
    self.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  _isMounted: boolean = false
  mostRecentCallback: ?LoadItemsCallback = null

  loadItems = (inputValue: string) => {
    const { loadItems, minimumInput } = this.props

    if (inputValue.length < minimumInput) {
      this.setState({
        loadingState: 'success',
        items: [],
      })

      return null
    }

    const callback = (err, data) => {
      if (callback !== this.mostRecentCallback) {
        return
      }

      if (this._isMounted) {
        this.setState({
          loadingState: err ? 'error' : 'success',
          items: (data && data.items) || [],
        })
      }
    }

    this.mostRecentCallback = callback

    this.setState({
      loadingState: 'loading',
    })

    const promise = loadItems(inputValue, callback)

    if (promise) {
      return promise.then(
        (data: LoadItemsData) => callback(null, data),
        (error: Object) => callback(error)
      )
    }

    return null
  }

  async onChange(value: *) {
    const promise = Promise.resolve(this.props.onChange(value))

    if (!promise || !promise.then) {
      return
    }

    this.setState({ loadingState: 'loading' })

    await promise.catch(() => {})

    if (this._isMounted) {
      this.setState({ loadingState: 'success' })
    }
  }

  onFocus = (...args: Array<any>) => {
    if (this.props.onFocus) {
      this.props.onFocus(...args)
    }

    if (this.mostRecentCallback === null) {
      this.loadItems('')
    }
  }

  onInputChange = (inputValue: string) => {
    const { onInputChange } = this.props

    if (onInputChange) {
      onInputChange(inputValue)
    }

    return this.loadItems(inputValue)
  }

  render() {
    const { children } = this.props
    const { items, loadingState } = this.state

    return children({
      items,
      loadingState,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onInputChange: this.onInputChange,
    })
  }
}

export default Async
