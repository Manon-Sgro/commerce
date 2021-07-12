import { FC, useEffect, useMemo } from 'react'

interface Props {
  className?: string
  width?: number
  height?: number
  fillColor?: string
}

const Circle: FC<Props> = ({
  width = 24,
  height = 24,
  fillColor = 'none',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      stroke={fillColor != 'none' ? fillColor : 'currentColor'}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fillColor}
      shapeRendering="geometricPrecision"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export default Circle
