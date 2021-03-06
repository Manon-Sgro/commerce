import { useEffect, useState } from 'react'
import getSlug from './get-slug'

export function useSearchMeta(asPath: string) {
  const [pathname, setPathname] = useState<string>('/search')
  const [category, setCategory] = useState<string | undefined>()
  const [brand, setBrand] = useState<string | undefined>()

  useEffect(() => {
    // Only access asPath after hydration to avoid a server mismatch
    const splitPath = asPath.split('?')
    const path = splitPath[0]
    const query = splitPath.length > 1 ? '?' + splitPath[1] : ''
    const parts = path.split('/')
    console.log('query')
    console.log(query)

    let c = parts[2]
    let b = parts[3]
    let s = parts[4]

    console.log('and the category is...')
    console.log(c)

    if (c === 'designers') {
      c = parts[4]
      s = parts[5]
    } else {
      s = parts[3]
      b = parts[4]
    }

    setPathname(path) // + query ?
    if (c && c + (s ? '/' + s : '') !== category)
      setCategory(c + (s ? '/' + s : ''))
    if (c === undefined && c !== category) setCategory('')
    if (b !== brand) setBrand(b)
  }, [asPath])

  return { pathname, category, brand }
}

// Removes empty query parameters from the query object
export const filterQuery = (query: any) =>
  Object.keys(query).reduce<any>((obj, key) => {
    if (query[key]?.length) {
      obj[key] = query[key]
    }
    return obj
  }, {})

export const getCategoryPath = (path: string, brand?: string) => {
  const category = getSlug(path)

  return `/search${brand ? `/designers/${brand}` : ''}${
    category ? `/${category}` : ''
  }`
}

export const getDesignerPath = (path: string, category?: string) => {
  const designer = getSlug(path).replace(/^brands/, 'designers')

  return `/search${designer ? `/${designer}` : ''}${
    category ? `/${category}` : ''
  }`
}
