import { FC, useEffect, useMemo } from 'react'

interface Props {
  className?: string
  width?: number
  height?: number
}

const Menu: FC<Props> = ({ width = 24, height = 24, ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 28 18`}
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M5 2L22 2M5 10L28 10M5 18L24 18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Menu
