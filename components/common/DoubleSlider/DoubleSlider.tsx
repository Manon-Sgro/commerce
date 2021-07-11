import cn from 'classnames'
import s from './DoubleSlider.module.css'
import { useRouter } from 'next/router'
import {
  FC,
  ReactNode,
  Component,
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react'

interface Props {
  className?: string
  id?: string
  min: number
  max: number
  onChange: Function
}

const DoubleSlider: FC<Props> = ({
  className,
  id,
  min = 0,
  max = 1000,
  onChange,
}) => {
  const [minValue, setMinValue] = useState(min)
  const [maxValue, setMaxValue] = useState(max)

  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const range = useRef(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value) => {
      Math.round(((value - min) / (max - min)) * 100)
    },
    [min, max]
  )

  // Set width of the range to change from the left side
  useEffect(() => {
    const minPercent = getPercent(minValue)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minValue, getPercent])

  // Set width of the range to change from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxValue)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxValue, getPercent])

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minValue, max: maxValue })
  }, [minValue, maxValue, onChange])

  return (
    <div className={s.section}>
      <input
        type="range"
        min={min}
        max={max}
        value={minValue}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxValue - 1)
          setMinValue(value)
          minValRef.current = value
        }}
        className={`${s.thumb} ${s.thumb__left}`}
      />
      <input
        type="range"
        min={min}
        max={max}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minValue + 1)
          setMaxValue(value)
          maxValRef.current = value
        }}
        className={`${s.thumb} ${s.thumb__right}`}
      />
      <div className={`${s.slider}`}>
        <div className={`${s.slider__track}`} />
        <div ref={range} className="slider__range" />
        <div className={s.slider__left__value}>{minValue}</div>
        <div className={s.slider__right__value}>{maxValue}</div>
      </div>
    </div>
  )
}

export default DoubleSlider
