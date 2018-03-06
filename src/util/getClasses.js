// @flow

import type { ClassMap } from '../types'

export default (classes: $Shape<ClassMap>) => ({
  disabled: 'disabled',
  focused: 'focused',
  input: 'rechoice-input',
  inputMirror: 'rechoice-input-mirror',
  inputWrapper: 'rechoice-input-wrapper',
  item: 'rechoice-item',
  menu: 'rechoice-menu',
  root: 'rechoice',
  selected: 'selected',
  tags: 'rechoice-tags',
  value: 'rechoice-value',
  ...classes,
})
