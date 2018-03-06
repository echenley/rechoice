// @flow

export function addClickListener(cb: EventHandler) {
  document.addEventListener('mousedown', cb)
  document.addEventListener('touchstart', cb)
}

export function removeClickListener(cb: EventHandler) {
  document.removeEventListener('mousedown', cb)
  document.removeEventListener('touchstart', cb)
}
