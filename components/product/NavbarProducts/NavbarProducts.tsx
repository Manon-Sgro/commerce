import cn from 'classnames'
import s from './NavbarProducts.module.css'
import { ArrowDown } from '@components/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, ReactNode, Component, useMemo, useState } from 'react'
import ClickOutside from '../../../lib/click-outside'
import {
  filterQuery,
  getCategoryPath,
  getDesignerPath,
  useSearchMeta,
} from '@lib/search'

interface Props {
  className?: string
  id?: string
  activeCategoryName?: string
}

const NavbarProducts: FC<Props> = ({ className, id, activeCategoryName }) => {
  const router = useRouter()
  const { asPath } = router

  const { pathname, category, brand } = useSearchMeta(asPath)
  const { q, sort } = router.query
  const query = filterQuery({ q, sort })

  const [displaySort, setDisplaySort] = useState(false)
  const possibleSortSelections = [
    'les plus récents',
    'tendances',
    'prix croissants',
    'prix décroissants',
  ]
  const [sortSelection, setSortSelection] = useState(possibleSortSelections[0])
  const SORT = Object.entries({
    'latest-desc': 'les plus récents',
    'trending-desc': 'tendances',
    'price-asc': 'prix croissants',
    'price-desc': 'prix décroissants',
  })
  const [activeFilter, setActiveFilter] = useState('')
  const [toggleFilter, setToggleFilter] = useState(false)
  const changeSortSelection = (el: string, filter: string) => {
    setSortSelection(el)
    setDisplaySort(false)
    if (filter !== activeFilter) {
      setToggleFilter(true)
    } else {
      setToggleFilter(!toggleFilter)
    }
    setActiveFilter(filter)
  }
  return (
    <div className={s.section}>
      <nav className={s.section_nav}>
        <div className={s.section_nav_item__filters}>
          <ArrowDown className={s.icon} width={15} height={15} />
          Filter
        </div>
        {activeCategoryName ? (
          <div className={s.section_nav_item__path}>
            <Link href="/">
              <a className={s.section_nav_item__path_link}>Accueil</a>
            </Link>{' '}
            /{' '}
            <Link href="/search">
              <a className={s.section_nav_item__path_link}>Catalogue</a>
            </Link>{' '}
            / <span>{activeCategoryName}</span>
          </div>
        ) : (
          <div className={s.section_nav_item__path}>
            <Link href="/">
              <a className={s.section_nav_item__path_link}>Accueil</a>
            </Link>{' '}
            / <span>Catalogue</span>
          </div>
        )}
        <ClickOutside
          active={displaySort}
          onClick={() => setDisplaySort(false)}
        >
          <div className={`${s.section_nav_item__sort_container}`}>
            <button
              className={`${s.section_nav_item__sort} ${s.section_nav_item_link}`}
              onClick={() => setDisplaySort(!displaySort)}
            >
              Trier par : {sortSelection}
              <ArrowDown className={s.icon} width={15} height={15} />
            </button>
            {displaySort && (
              <div className={s.section_dropDown__sort}>
                <ul>
                  {SORT.map(([key, text]) => (
                    <li key={key}>
                      <Link
                        href={{
                          pathname,
                          query: filterQuery({ q, sort: key }),
                        }}
                      >
                        <a
                          onClick={() => changeSortSelection(text, 'sort')}
                          className={s.section_dropDown__sort_item}
                        >
                          Trier par : {text}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ClickOutside>
      </nav>
    </div>
  )
}

export default NavbarProducts
