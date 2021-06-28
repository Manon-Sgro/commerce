import { FC } from 'react'
import Link from 'next/link'
import { Logo, Container } from '@components/ui'
import { ArrowDown } from '@components/icons'
import { Searchbar, UserNav } from '@components/common'
import NavbarRoot from './NavbarRoot'
import s from './Navbar.module.css'

const Navbar: FC = () => (
  <NavbarRoot>
    <Container>
      <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
        <div className="flex items-center flex-1">
          <Link href="/index2">
            <a className={s.logo} aria-label="Logo">
              <Logo />
            </a>
          </Link>
          <nav className="hidden ml-6 space-x-4 lg:block">
            <Link href="/search">
              <a className={s.link}>
                <span>All</span>
              </a>
            </Link>
            <Link href="/search/fruits">
              <a className={s.link}>
                Fruits
                <ArrowDown className={s.icon} width={15} height={15} />
              </a>
            </Link>
            <Link href="/search/legumes">
              <a className={s.link}>
                Légumes
                <ArrowDown className={s.icon} width={15} height={15} />
              </a>
            </Link>
            <Link href="/search/paniers">
              <a className={s.link}>
                Paniers composés
                <ArrowDown className={s.icon} width={15} height={15} />
              </a>
            </Link>
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
