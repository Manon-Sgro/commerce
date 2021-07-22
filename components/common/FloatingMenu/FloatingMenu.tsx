import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import s from './FloatingMenu.module.css'
import { useRouter } from 'next/router'
import { Button } from '../../ui'
import Link from 'next/link'

interface Props {
  className?: string
  submenus: { title: string; children: string[] }[]
}

const FloatingMenu: FC<Props> = ({ className, submenus }) => {
  return (
    <div className={`${className} ${s.root}`}>
      {submenus.map((el) => (
        <ul className={s.root_section}>
          <li className={s.root_section_title}>
            <Link href={`/search/${el.title}`}>
              <a>{el.title}</a>
            </Link>
          </li>
          {el.children.map((child) => (
            <li className={s.root_section_item}>
              <Link href={`/search/${el.title}/${child}`}>
                <a>{child}</a>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default FloatingMenu
