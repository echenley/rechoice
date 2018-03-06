// @flow

import generateId from '../generateId'

describe('generateId', () => {
  it('generates ids correctly', () => {
    expect(generateId('prefix')).toBe('prefix-0')
    expect(generateId('prefix')).toBe('prefix-1')
    expect(generateId('prefix')).toBe('prefix-2')
    expect(generateId('prefix')).toBe('prefix-3')
    expect(generateId('prefix')).toBe('prefix-4')
  })
})
