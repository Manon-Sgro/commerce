import cn from 'classnames'
import s from './NavbarLinks.module.css'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo } from 'react'

interface Props {
  className?: string
  id?: string
  children: ReactNode[] | Component[] | any[]
}

const NavbarLinks: FC<Props> = ({ className, id, children }) => {
  return useMemo(
    () => (
      <div className={s.section}>
        <ul className={s.section_list}>{children}</ul>
      </div>
    ),
    []
  )
}

export default NavbarLinks
