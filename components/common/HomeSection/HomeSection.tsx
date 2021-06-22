import { FC, useEffect, useMemo } from 'react'
import cn from 'classnames'
import s from './HomeSection.module.css'
import { useRouter } from 'next/router'

interface Props {
  className?: string
  id?: string
}

const HomeSection: FC<Props> = ({ className, id = 'home' }) => {
  /*
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/home')
  }, [])
  */
  return useMemo(
    () => (
      <div className={s.section}>
        <div className={s.section_titlePart}>
          <h1 className={s.section_title}>Fruits et légumes pour l'été !</h1>
          <h2>
            Faîtes le plein de vitamines avec nos produits frais et locaux.
          </h2>
        </div>
      </div>
    ),
    []
  )
}

export default HomeSection
