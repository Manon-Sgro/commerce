import cn from 'classnames'
import s from './NavbarProducts.module.css'
import { ArrowDown } from '@components/icons'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo } from 'react'

interface Props {
  className?: string
  id?: string
}

const NavbarProducts: FC<Props> = ({ className, id }) => {
  return useMemo(
    () => (
      <div className={s.section}>
        <nav className={s.section_nav}>
          <div className={s.section_nav_item__filters}>
            <ArrowDown className={s.icon} width={15} height={15} />
            Filter
          </div>
          <div className={s.section_nav_item__path}>Home / The shop</div>
          <div className={s.section_nav_item__sort}>
            Sort by latest
            <ArrowDown className={s.icon} width={15} height={15} />
          </div>
        </nav>
      </div>
    ),
    []
  )
}

export default NavbarProducts
