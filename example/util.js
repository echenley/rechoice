// @flow

import React from 'react'

export function highlightText(text: string, match: string) {
  if (!match || !text.indexOf(match) === -1) {
    return text
  }

  let output = text

  output = output.split(new RegExp(`(${match})`, 'gi')).map((part, i) => {
    if (part.toLowerCase() === match.toLowerCase()) {
      return <strong key={i}>{part}</strong>
    }

    return part
  })

  return output
}
