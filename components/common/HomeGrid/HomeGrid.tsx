import cn from 'classnames'
import s from './HomeGrid.module.css'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo } from 'react'

interface Props {
  className?: string
  layout?: 'line' | 'full' | 'A'
  id?: string
  title?: string
  subtitle?: string
  children?: ReactNode[] | Component[] | any[]
}

const HomeGrid: FC<Props> = ({
  className,
  layout,
  id = 'home',
  title,
  subtitle,
  children,
}) => {
  const gridClassName = cn(
    s.root,
    {
      [s.gridA]: layout === 'A',
      [s.gridFull]: layout === 'full',
      [s.grid]: layout === 'line',
    },
    className
  )
  return useMemo(
    () => (
      <div className={`${s.section} ${layout == 'full' ? 'full' : ''}`}>
        <div className={s.section_titlePart}>
          <h1 className={s.section_title}>{title}</h1>
          <h2 className={s.section_subtitle}>{subtitle}</h2>
        </div>
        <div className={gridClassName}>{children}</div>
      </div>
    ),
    []
  )
}

export default HomeGrid
