import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import s from './Searchbar.module.css'
import { useRouter } from 'next/router'
import { Cross } from '@components/icons'
import { Button } from '../../ui'
import Link from 'next/link'
import ClickOutside from '../../../lib/click-outside'

interface Props {
  className?: string
  id?: string
}

const Searchbar: FC<Props> = ({ className, id = 'search' }) => {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/search')
  }, [])

  const [display, setDisplay] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')

  const activeSearchbar = () => {
    setDisplay(true)
  }

  return (
    <div
      className={`${cn(
        'relative text-sm text-base transition-colors duration-150',
        className
      )} ${s.root}`}
    >
      <button
        className={s.icon_container__small}
        onClick={() => setDisplay(true)}
      >
        <svg className={s.icon_small} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          />
        </svg>
      </button>
      <div className={`${s.root_bg} ${display ? s.active : s.inactive}`}>
        <ClickOutside active={display} onClick={() => setDisplay(false)}>
          <div className={s.root_searchbar}>
            <button className={s.icon__cross} onClick={() => setDisplay(false)}>
              <Cross />
            </button>
            <label className={s.label} htmlFor={id}>
              Que cherchez-vous ?
            </label>
            <div className={s.input_container}>
              <input
                id={id}
                className={s.input}
                placeholder="entrez un produit..."
                defaultValue={router.query.q}
                onKeyUp={(e) => {
                  e.preventDefault()

                  if (e.key === 'Enter') {
                    const q = e.currentTarget.value
                    setCurrentQuery(q)

                    router.push(
                      {
                        pathname: `/search`,
                        query: q ? { q } : {},
                      },
                      undefined,
                      { shallow: true }
                    )
                    setDisplay(false)
                  }
                }}
              />
              <div className={s.iconContainer}>
                <svg className={s.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </ClickOutside>
      </div>
    </div>
  )
}

export default Searchbar
