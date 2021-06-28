import { FC, useEffect, useMemo } from 'react'

interface Props {
  className?: string
  width?: number
  height?: number
}

const ArrowUp: FC<Props> = ({ width = 24, height = 24, ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 24 24`}
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M5 12L12 19L19 12"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowUp
