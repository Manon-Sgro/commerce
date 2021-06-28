import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Page } from '@framework/common/get-all-pages'
import getSlug from '@lib/get-slug'
import { Github, Vercel } from '@components/icons'
import { Logo, Container } from '@components/ui'
import { I18nWidget } from '@components/common'
import Image, { ImageProps } from 'next/image'
import s from './Footer.module.css'

interface Props {
  className?: string
  children?: any
  pages?: Page[]
}

const LEGAL_PAGES = ['terms-of-use', 'shipping-returns', 'privacy-policy']

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages, legalPages } = usePages(pages)
  const rootClassName = cn(className)

  return (
    <footer className={rootClassName}>
      <Container>
        <div className={s.root}>
          <ul className={s.list}>
            <li className={s.list_item}>
              <Link href="/">
                <a>
                  <Image
                    quality="85"
                    src="/f_logo_RGB-Black_100.png"
                    alt="Facebook"
                    height={32}
                    width={32}
                    objectFit="contain"
                    layout="fixed"
                  />
                  <span className={s.sr_only}>Facebook</span>
                </a>
              </Link>
            </li>
            <li className={s.list_item}>
              <Link href="/">
                <a>
                  <Image
                    quality="85"
                    src="/twitter_logo.png"
                    alt="Facebook"
                    height={32}
                    width={32}
                    objectFit="contain"
                    layout="fixed"
                  />
                  <span className={s.sr_only}>Twitter</span>
                </a>
              </Link>
            </li>
            <li className={s.list_item}>
              <Link href="/">
                <a>
                  <Image
                    quality="85"
                    src="/badgeRGB-000000.png"
                    alt="Facebook"
                    height={32}
                    width={32}
                    objectFit="contain"
                    layout="fixed"
                  />
                  <span className={s.sr_only}>Pinterest</span>
                </a>
              </Link>
            </li>
            <li className={s.list_item}>
              <Link href="/">
                <a>
                  <Image
                    quality="85"
                    src="/glyph-logo_May2016.png"
                    alt="Facebook"
                    height={32}
                    width={32}
                    objectFit="contain"
                    layout="fixed"
                  />
                  <span className={s.sr_only}>Instagram</span>
                </a>
              </Link>
            </li>
          </ul>
          <div>
            <span>&copy; 2020 ACME, Inc. All rights reserved.</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function usePages(pages?: Page[]) {
  const { locale } = useRouter()
  const sitePages: Page[] = []
  const legalPages: Page[] = []

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url)

      if (!slug) return
      if (locale && !slug.startsWith(`${locale}/`)) return

      if (isLegalPage(slug, locale)) {
        legalPages.push(page)
      } else {
        sitePages.push(page)
      }
    })
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
    legalPages: legalPages.sort(bySortOrder),
  }
}

const isLegalPage = (slug: string, locale?: string) =>
  locale
    ? LEGAL_PAGES.some((p) => `${locale}/${p}` === slug)
    : LEGAL_PAGES.includes(slug)

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

export default Footer
