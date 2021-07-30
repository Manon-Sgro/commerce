import { FC } from 'react'
import Link from 'next/link'
import { Logo, Container } from '@components/ui'
import { ArrowDown } from '@components/icons'
import { Searchbar, UserNav, FloatingMenu } from '@components/common'
import NavbarRoot from './NavbarRoot'
import s from './Navbar.module.css'

const openMenu = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.classList.add('hover')
}
const closeMenu = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.classList.remove('hover')
}

// TODO : get from categories
const submenus = [
  {
    title: 'Saison',
    path: '/saison',
    children: [
      { name: 'Ete', path: '/ete' },
      { name: 'Hiver', path: '/hiver' },
    ],
  },
  {
    title: 'Tendances',
    sort: 'trending-desc',
    children: [
      { name: 'Bio', query: 'bio' },
      { name: 'Produits locaux', query: 'local' },
    ],
  },
  {
    title: 'Origine',
    path: '/origine',
    children: [
      { name: 'Espagne', path: '/espagne' },
      { name: 'France', path: '/france' },
      { name: 'Kenya', path: '/kenya' },
    ],
  },
  { title: 'Meilleures ventes', sort: 'trending-desc', children: [] },
  { title: 'Produits récents', sort: 'latest-desc', children: [] },
]

const Navbar: FC = () => (
  <NavbarRoot>
    <Container>
      <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
        <div className="flex items-center flex-1">
          <Link href="/">
            <a className={s.logo} aria-label="Logo">
              <Logo />
            </a>
          </Link>
          <nav className="hidden ml-6 space-x-4 lg:block">
            <Link href="/search">
              <a className={s.link}>
                <span>Tous nos produits</span>
              </a>
            </Link>
            <div className={s.link__floating}>
              <Link href="/search/fruits">
                <a className={s.link}>
                  Fruits
                  <ArrowDown className={s.icon} width={15} height={15} />
                </a>
              </Link>
              <FloatingMenu
                className={s.link__floating_floatingMenu}
                submenus={submenus}
                menu="/fruits"
              />
            </div>

            <div className={s.link__floating}>
              <Link href="/search/legumes">
                <a className={s.link}>
                  Légumes
                  <ArrowDown className={s.icon} width={15} height={15} />
                </a>
              </Link>
              <FloatingMenu
                className={s.link__floating_floatingMenu}
                submenus={submenus}
                menu="/legumes"
              />
            </div>

            <div className={s.link__floating}>
              <Link href="/search/paniers">
                <a className={s.link}>
                  Paniers composés
                  <ArrowDown className={s.icon} width={15} height={15} />
                </a>
              </Link>
              <FloatingMenu
                className={s.link__floating_floatingMenu}
                submenus={submenus}
                menu="/paniers_composes"
              />
            </div>
          </nav>
        </div>

        <div className="flex justify-end flex-1">
          <UserNav />
          <Searchbar id="mobile-search" />
        </div>
      </div>
    </Container>
  </NavbarRoot>
)

export default Navbar
