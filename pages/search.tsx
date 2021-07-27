import cn from 'classnames'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  DoubleSlider,
  Layout,
  NavbarLinks,
  Title,
  TopButton,
} from '@components/common'
import { NavbarProducts, ProductCard2 } from '@components/product'
import s from '@components/product/NavbarProducts/NavbarProducts.module.css'
import { Container, Grid, Skeleton } from '@components/ui'
import { ArrowDown, Menu, Circle, Cross } from '@components/icons'

import { getConfig } from '@framework/api'
import useSearch from '@framework/product/use-search'
import getAllPages from '@framework/common/get-all-pages'
import getSiteInfo from '@framework/common/get-site-info'

import rangeMap from '@lib/range-map'

// TODO(bc) Remove this. This should come from the API
import getSlug from '@lib/get-slug'

// Material-UI accordion
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

// TODO (bc) : Remove or standarize this.
const SORT = Object.entries({
  'latest-desc': 'les plus récents',
  'trending-desc': 'tendances',
  'price-asc': 'prix croissants',
  'price-desc': 'prix décroissants',
})

import {
  filterQuery,
  getCategoryPath,
  getDesignerPath,
  useSearchMeta,
} from '@lib/search'
import { Product } from '@commerce/types'
import ClickOutside from '../lib/click-outside'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  const { categories, brands } = await getSiteInfo({ config, preview })
  return {
    props: {
      pages,
      categories,
      brands,
    },
  }
}

export default function Search({
  categories,
  brands,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [activeFilter, setActiveFilter] = useState('')
  const [toggleFilter, setToggleFilter] = useState(false)

  const router = useRouter()
  const { asPath } = router
  const { q, sort } = router.query
  // `q` can be included but because categories and designers can't be searched
  // in the same way of products, it's better to ignore the search input if one
  // of those is selected
  const query = filterQuery({ q, sort })

  const { pathname, category, brand } = useSearchMeta(asPath)
  const flattenCategories = new Array()
  categories.forEach((cat) => {
    flattenCategories.push(cat)
    cat.children.forEach((subcat) => flattenCategories.push(subcat))
  })
  console.log('search')
  console.log(category)
  //flattenCategories.forEach((cat) => console.log(getSlug(cat.path)))
  const activeCategory = flattenCategories.find(
    (cat) => getSlug(cat.path) === category
  )
  console.log('activeCategory')
  console.log(activeCategory)
  const activeBrand = brands.find(
    (b) => getSlug(b.node.path) === `brands/${brand}`
  )?.node

  const { data } = useSearch({
    search: typeof q === 'string' ? q : '',
    categoryId: activeCategory?.entityId,
    brandId: activeBrand?.entityId,
    sort: typeof sort === 'string' ? sort : '',
  })

  const handleClick = (event: any, filter: string) => {
    if (filter !== activeFilter) {
      setToggleFilter(true)
    } else {
      setToggleFilter(!toggleFilter)
    }
    setActiveFilter(filter)
  }

  const [displaySort, setDisplaySort] = useState(false)
  const [displayFilters, setDisplayFilters] = useState(false)
  const currentSelection = SORT.find((el) => el[0] == sort)
  const [sortSelection, setSortSelection] = useState(
    currentSelection ? currentSelection[1] : SORT[0][1]
  )
  const changeSortSelection = (event: any, el: string, filter: string) => {
    setSortSelection(el)
    setDisplaySort(false)
    handleClick(event, 'sort')
  }

  const minProductPrice = 0
  const [maxProductPrice] = useState(
    data
      ? data.products
          .map((el) => el.price.value)
          .reduce((max, currPrice) =>
            currPrice > max ? Math.floor(currPrice) + 1 : max
          )
      : 1000
  )
  //const [maxProductPrice] = useState(50);
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(maxProductPrice)
  const [minPriceFilter, setMinPriceFilter] = useState(0)
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxProductPrice)
  let subcategories = []
  /*
  const addSubcategory = (name: string) => {
    setSubcategories((prevItems) => [
      ...prevItems.filter((el) => el !== name),
      name
    ])
  }
  */

  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([])
  // handle click event of the button to add item
  const addActiveFilter = (name: string, value: string) => {
    setActiveFilters((prevItems) => [
      ...prevItems.filter((el) => el.name !== name),
      {
        name: name,
        value: value,
      },
    ])
  }
  const removeActiveFilter = (name: string) => {
    // reset filters
    if (name === 'Min') {
      setMinPriceFilter(minProductPrice)
    }
    if (name === 'Max') {
      setMaxPriceFilter(maxProductPrice)
    }

    // remove filter from list
    setActiveFilters(activeFilters.filter((el) => el.name !== name))
  }

  // Material-UI accordion
  const classes = useStyles()

  return (
    <Container className="ml-20 mr-20">
      {activeCategory && activeCategory.name.startsWith('#') && (
        <Title
          title={`${activeCategory.name}`}
          subtitle={activeCategory.description}
          bgImageUrl={activeCategory.image.url}
        />
      )}
      {activeCategory && !activeCategory.name.startsWith('#') && (
        <Title title={activeCategory.name} />
      )}
      {!activeCategory && <Title title="Notre catalogue" />}
      {!activeCategory && (
        <NavbarLinks>
          {categories
            .filter((el) => el.children.length == 0)
            .map((cat) => (
              <li
                key={cat.path}
                className={cn(
                  'block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                )}
              >
                <Link
                  href={{
                    pathname: getCategoryPath(cat.path, brand),
                    query,
                  }}
                >
                  <a
                    onClick={(e) => handleClick(e, 'categories')}
                    className={
                      'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                    }
                  >
                    {cat.name}
                  </a>
                </Link>
              </li>
            ))}
        </NavbarLinks>
      )}
      {/* NavbarProducts */}
      <div className={s.section}>
        <nav className={s.section_nav}>
          {displayFilters && <div className={s.section_filters_bg}></div>}
          <ClickOutside
            active={displayFilters}
            onClick={() => setDisplayFilters(false)}
          >
            <div>
              <button
                className={`${s.section_nav_item__filters} ${s.section_nav_item_link}`}
                onClick={() => setDisplayFilters(!displayFilters)}
              >
                <Menu className={s.icon} width={15} height={15} />
                Filtres
              </button>
              {displayFilters && (
                <div className={s.section_filters}>
                  {activeFilters.length > 0 && (
                    <section className={s.section_filters_part}>
                      <div className={s.section_filters_part_title}>
                        Filtres actifs
                      </div>
                      <ul>
                        {activeFilters.map((filter) => (
                          <li
                            key={filter.name}
                            className={`${s.section_filters_item}`}
                          >
                            <button
                              className={`${s.section_nav_item_link} ${s.section_filters_btn}`}
                              onClick={() => removeActiveFilter(filter.name)}
                            >
                              <div className={`${s.section_filters_btn_cross}`}>
                                <Cross
                                  width={12}
                                  height={12}
                                  stroke-width={4}
                                />
                              </div>
                              <div className={`${s.section_filters_btn_name}`}>
                                {filter.name}
                              </div>
                            </button>
                            <div className={`${s.section_filters_value}`}>
                              {filter.value}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <section className={s.section_filters_part}>
                    <div className={s.section_filters_part_title}>
                      Catégories de produits
                    </div>
                    <ul>
                      {categories
                        .filter((el) => el.children.length == 0)
                        .map((cat) => (
                          <li
                            key={cat.path}
                            className={`${s.section_filters_part_item} ${s.section_nav_item_link}`}
                          >
                            <Circle
                              width={15}
                              height={15}
                              fillColor={
                                activeCategory?.entityId === cat.entityId
                                  ? '#EC7A5C'
                                  : 'none'
                              }
                            />
                            <Link
                              href={{
                                pathname: getCategoryPath(cat.path, brand),
                                query,
                              }}
                            >
                              <a
                                onClick={(e) => handleClick(e, 'categories')}
                                className={
                                  activeCategory?.entityId === cat.entityId
                                    ? s.section_filters_part_item__bold
                                    : ''
                                }
                              >
                                {cat.name}
                              </a>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </section>
                  <section className={s.section_filters_part}>
                    <div className={s.section_filters_part_title}>
                      Filtrer par prix
                    </div>
                    <DoubleSlider
                      min={minProductPrice}
                      max={maxProductPrice}
                      onChange={({
                        min,
                        max,
                      }: {
                        min: number
                        max: number
                      }) => {
                        setMinPrice(min)
                        setMaxPrice(max)
                      }}
                    />
                    <div className={s.section_filters_price_actions}>
                      <div className={s.section_filters_price_actions_infos}>
                        Prix: {minPrice}€ — {maxPrice}€
                      </div>
                      <button
                        className={s.section_filters_price_actions_btn}
                        onClick={() => {
                          addActiveFilter('Min', minPrice.toString() + '€')
                          addActiveFilter('Max', maxPrice.toString() + '€')
                          setMinPriceFilter(minPrice)
                          setMaxPriceFilter(maxPrice)
                        }}
                      >
                        Filtrer
                      </button>
                    </div>
                  </section>
                  {categories.map((cat) => {
                    if (cat.children.length > 0) {
                      return (
                        <section
                          key={cat.name}
                          className={s.section_filters_part}
                        >
                          <div className={s.section_filters_part_title}>
                            Filtrer par {cat.name}
                          </div>
                          <ul className={s.section_filters_part_options}>
                            {cat.children.map((subcat) => (
                              <li
                                className={s.section_filters_part_options_item}
                              >
                                <button
                                  onClick={() => {
                                    addActiveFilter(cat.name, subcat.name)
                                  }}
                                >
                                  {subcat.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )
                    }
                  })}
                </div>
              )}
            </div>
          </ClickOutside>

          {activeCategory ? (
            <div className={s.section_nav_item__path}>
              <Link href="/">
                <a className={s.section_nav_item__path_link}>Accueil</a>
              </Link>{' '}
              /{' '}
              <Link href="/search">
                <a className={s.section_nav_item__path_link}>Catalogue</a>
              </Link>{' '}
              / <span>{activeCategory.name}</span>
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
                Trier par :{' '}
                {currentSelection ? currentSelection[1] : SORT[0][1]}
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
                            onClick={(e) =>
                              changeSortSelection(e, text, 'sort')
                            }
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 mb-20">
        {/* Products */}
        <div className="col-span-12 order-3 lg:order-none">
          {(q || activeCategory || activeBrand) && (
            <div className="mb-12 transition ease-in duration-75">
              {data ? (
                <>
                  <span
                    className={cn('animated', {
                      fadeIn: data.found,
                      hidden: !data.found,
                    })}
                  >
                    {' '}
                    {
                      /* TODO : do it within the products request */
                      data.products
                        .filter(
                          (el) =>
                            el.price.value >= minPriceFilter &&
                            el.price.value <= maxPriceFilter
                        )
                        .filter((el) =>
                          activeFilters
                            .map((item) => item.value)
                            .every((item) =>
                              el.categories.edges
                                .map((i: any) => i.node.name)
                                .includes(item)
                            )
                        ).length
                    }{' '}
                    résultats{' '}
                    {q && (
                      <>
                        pour "<strong>{q}</strong>"
                      </>
                    )}
                  </span>
                  <span
                    className={cn('animated', {
                      fadeIn: !data.found,
                      hidden: data.found,
                    })}
                  >
                    {q ? (
                      <>
                        Aucun produit ne correspond à "<strong>{q}</strong>"
                      </>
                    ) : (
                      <>
                        Aucun produit ne correspond à la catégorie selectionnée.
                      </>
                    )}
                  </span>
                </>
              ) : q ? (
                <>
                  Recherche pour : "<strong>{q}</strong>"
                </>
              ) : (
                <>Recherche en cours...</>
              )}
            </div>
          )}

          {data ? (
            <Grid layout="normal">
              {
                /* TODO : do it within the products request */
                data.products
                  .filter(
                    (el) =>
                      el.price.value >= minPriceFilter &&
                      el.price.value <= maxPriceFilter
                  )
                  .filter((el) =>
                    activeFilters
                      .map((item) => item.value)
                      .every((item) =>
                        el.categories.edges
                          .map((i: any) => i.node.name)
                          .includes(item)
                      )
                  )
                  .map((product: Product) => {
                    /*
                    product.customFields.edges.forEach((el: any) => {
                      if (enabledFiltersNames.includes(el.node.name.toLowerCase())) {
                        addFilterValues(el.node.value, el.node.name.toLowerCase());
                      }
                    });
                    */
                    return (
                      <ProductCard2
                        key={product.id}
                        link={'/product/' + product.slug}
                        title={product.name}
                        variant="details"
                        imageSrc={product.images[0].url}
                        imageSrc2={
                          product.images.length > 1 ? product.images[1].url : ''
                        }
                        product={product}
                        imgProps={{
                          width: 206,
                          height: 256,
                        }}
                      />
                    )
                  })
              }
            </Grid>
          ) : (
            <Grid layout="normal">
              {rangeMap(12, (i) => (
                <Skeleton
                  key={i}
                  className="w-full animated fadeIn"
                  height={325}
                />
              ))}
            </Grid>
          )}
        </div>
      </div>
      <div className={s.endItems}>
        Il n'y a pas d'autres articles disponibles.
      </div>
      <TopButton />
    </Container>
  )
}

Search.Layout = Layout
