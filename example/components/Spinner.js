// @flow

import * as React from 'react'

const Spinner = () => {
  return (
    <svg height="18px" viewBox="0 0 18 18" width="18px">
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <path
          d="M9,0 C4.02943725,0 0,4.02943725 0,9 C0,13.9705627 4.02943725,18 9,18 C13.9705627,18 18,13.9705627 18,9 L15,9 C15,12.3137085 12.3137085,15 9,15 C5.6862915,15 3,12.3137085 3,9 C3,5.6862915 5.6862915,3 9,3 L9,0 Z"
          fill="#C2CBD2"
          id="Combined-Shape"
        >
          <animateTransform
            attributeName="transform"
            dur="1"
            from="0 9 9"
            repeatCount="indefinite"
            to="360 9 9"
            type="rotate"
          />
        </path>
      </g>
    </svg>
  )
}

export default Spinner
