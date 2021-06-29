import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import s from './TopButton.module.css'
import { useRouter } from 'next/router'
import { ArrowUp } from '@components/icons'
import { Link } from '@material-ui/core'

interface Props {
  className?: string
  id?: string
}

const TopButton: FC<Props> = ({ className, id = 'home' }) => {
  /*
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/home')
  }, [])
  */
  const [scrollHeight, setScrollHeight] = useState(307.919)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = () => {
    setScrollHeight((307.919 * window.scrollY) / window.pageYOffset)
    console.log(scrollHeight)
  }

  return useMemo(
    () => (
      <button
        onClick={() => {
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
        }}
        className={s.root}
      >
        <div className={s.container}>
          <div className={s.container_icon}>
            <ArrowUp width={20} height={20} />
          </div>
        </div>
        <svg
          className={s.progress_circle}
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              transition: 'stroke-dashoffset 10ms linear 0s',
              strokeDasharray: '307.919px, 307.919px',
              strokeDashoffset: `${scrollHeight}px`,
            }}
          ></path>
        </svg>
      </button>
    ),
    []
  )
}

export default TopButton
