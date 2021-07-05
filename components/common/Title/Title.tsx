import cn from 'classnames'
import s from './Title.module.css'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo } from 'react'

interface Props {
  className?: string
  id?: string
  title?: string
}

const Title: FC<Props> = ({ className, id, title }) => {
  return useMemo(
    () => (
      <div className={s.section}>
        <h1 className={s.section_title}>{title}</h1>
      </div>
    ),
    []
  )
}

export default Title
