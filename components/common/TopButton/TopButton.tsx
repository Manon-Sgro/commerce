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
      <Link>
        <div className={s.container}>
          <div className={s.container_filled}></div>
          <div className={s.container_icon}>
            <ArrowUp />
          </div>
        </div>
      </Link>
    ),
    []
  )
}

export default TopButton
