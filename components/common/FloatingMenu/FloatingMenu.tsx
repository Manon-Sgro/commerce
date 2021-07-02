import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import s from './FloatingMenu.module.css'
import { useRouter } from 'next/router'
import { Button } from '../../ui'
import Link from 'next/link'

interface Props {
  className?: string
  id?: string
}

const FloatingMenu: FC<Props> = ({ className, id = 'search' }) => {
  return <div className={`${className} ${s.root}`}>Dropdown</div>
}

export default FloatingMenu
