import * as modules from '../index'

describe('exports', () => {
  it('exports the correct modules', () => {
    expect(modules).toMatchSnapshot()
  })
})
