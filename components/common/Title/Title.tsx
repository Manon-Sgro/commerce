import cn from 'classnames'
import s from './Title.module.css'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo } from 'react'

interface Props {
  className?: string
  id?: string
  title?: string
  subtitle?: string
  bgImageUrl?: Object
}

const Title: FC<Props> = ({ className, id, title, subtitle, bgImageUrl }) => {
  return useMemo(
    () => (
      <div className={s.section}>
        <header className={bgImageUrl ? 'headerWithBg' : ''}>
          <h1 className={s.section_title}>{title}</h1>
          {subtitle ? (
            <p
              className={s.section_subtitle}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            ></p>
          ) : null}
        </header>
        <style jsx>{`
          .headerWithBg {
            background-image: url(${bgImageUrl});
            background-position: center center;
            background-size: cover;
            color: #fff;
            width: 100%;
            height: 75vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    ),
    []
  )
}

export default Title
