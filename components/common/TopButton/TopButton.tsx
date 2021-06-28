import { FC, useEffect, useMemo } from 'react'
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
        <div className={s.container_filled}></div>
        <div className={s.container}>
          <div className={s.container_icon}>
            <ArrowUp width={40} height={40} />
          </div>
        </div>
      </button>
    ),
    []
  )
}

export default TopButton
