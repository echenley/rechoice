import { addClickListener, removeClickListener } from '../clickListener'

document.addEventListener = jest.fn()
document.removeEventListener = jest.fn()

describe('addClickListener', () => {
  it('calls document.addEventListener with cb', () => {
    const cb = () => {}
    addClickListener(cb)
    expect(document.addEventListener).toHaveBeenCalledWith('mousedown', cb)
    expect(document.addEventListener).toHaveBeenCalledWith('touchstart', cb)
  })
})

describe('removeClickListener', () => {
  it('calls document.removeEventListener with cb', () => {
    const cb = () => {}
    removeClickListener(cb)
    expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', cb)
    expect(document.removeEventListener).toHaveBeenCalledWith('touchstart', cb)
  })
})
