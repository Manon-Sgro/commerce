import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import s from './FloatingMenu.module.css'
import { useRouter } from 'next/router'
import { Button } from '../../ui'
import Link from 'next/link'
import { useSearchMeta } from '@lib/search'

interface Props {
  className?: string
  menu: string
  submenus: {
    title: string
    path?: string
    sort?: string
    children: { name: string; path?: string; query?: string }[]
  }[]
}

const FloatingMenu: FC<Props> = ({ className, submenus, menu }) => {
  return (
    <div className={`${className} ${s.root}`}>
      {submenus.map((el) => (
        <ul className={s.root_section}>
          <li className={s.root_section_title}>
            <Link
              href={`/search${menu}${el.path ? el.path : '?sort=' + el.sort}`}
            >
              <a>{el.title}</a>
            </Link>
          </li>
          {el.children.map((child) => (
            <li className={s.root_section_item}>
              <Link
                href={`/search${menu}${
                  child.path ? child.path : '?q=' + child.query
                }${child.query && el.sort ? '&' : '?'}${
                  el.sort ? 'sort=' + el.sort : ''
                }`}
              >
                <a>{child.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default FloatingMenu
