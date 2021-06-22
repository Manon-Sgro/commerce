import cn from 'classnames'
import s from './HomeGrid.module.css'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo } from 'react'

interface Props {
  layout?: 'line' | 'A'
  id?: string
  title?: string
  subtitle?: string
  children?: ReactNode[] | Component[] | any[]
}

const HomeGrid: FC<Props> = ({
  layout,
  id = 'home',
  title,
  subtitle,
  children,
}) => {
  /*
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/home')
  }, [])
  */
  return useMemo(
    () => (
      <div className={s.section}>
        <div className={s.section_titlePart}>
          <h1 className={s.section_title}>{title}</h1>
          <h2 className={s.section_subtitle}>{subtitle}</h2>
        </div>
        <div className={s.grid}>{children}</div>
      </div>
    ),
    []
  )
}

export default HomeGrid
