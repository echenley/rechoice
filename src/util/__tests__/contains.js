import contains from '../contains'

const parentNode = {}
const nonParentNode = {}
const childNode = {
  parentNode: {
    parentNode: {
      parentNode,
    },
  },
}

describe('contains util', () => {
  it('returns true if the parent node contains the child', () => {
    expect(contains(parentNode, childNode)).toBe(true)
  })

  it('returns false if the parent node does not contain the child', () => {
    expect(contains(nonParentNode, childNode)).toBe(false)
  })
})
