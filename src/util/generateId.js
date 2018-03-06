// @flow

let i = 0

export default function generateId(prefix: string) {
  return `${prefix}-${i++}`
}
