import cn from 'classnames'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { DoubleSlider, Layout, NavbarLinks, Title } from '@components/common'
import { NavbarProducts, ProductCard } from '@components/product'
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

interface GetFilters {
  data: any[]
}

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  const { categories, brands } = await getSiteInfo({ config, preview })
  const allFilters = await config.storeApiFetch<GetFilters>(
    `/v3/settings/search/filters`
  )
  return {
    props: {
      pages,
      categories,
      brands,
      allFilters,
    },
  }
}

export default function Search({
  categories,
  brands,
  allFilters,
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

  const enabledFilters = allFilters?.data
    .filter((el) => el.is_enabled)
    .map((el) => {
      return {
        display_name: el.display_name.split(':')[0],
        values:
          el.display_name.split(':').length > 1
            ? el.display_name.split(':')[1].split('-')
            : null,
        selected: false,
      }
    })
  // const enabledFiltersNames = enabledFilters.map((el) => el.display_name.toLowerCase())
  //const [additionnalFilters, setAdditionnalFilters] = useState<{ display_name: string, values: string[] }[]>([])
  console.log('filters')
  console.log(enabledFilters)
  const SelectOption = (optionName: string) => {
    const foundTrueOption = enabledFilters.find((el) => el.selected == true)
    if (foundTrueOption) {
      foundTrueOption.selected = false
    }
    const foundOption = enabledFilters.find(
      (el) => el.display_name == optionName
    )
    if (foundOption) {
      foundOption.selected = true
    }
  }
  /*
  const addFilterValues = (values: string, name: string) => {
    setAdditionnalFilters((prevItems) => [
      ...prevItems.filter((el) => el.display_name.toLowerCase() !== name),
      {
        display_name: name,
        values: values.split('-'),
      },
    ])
  }
  */

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
    <Container>
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
          {categories.map((cat) => (
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
                      {categories.map((cat) => (
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
                  {enabledFilters
                    .filter((el) => el.values)
                    .map((filter) => (
                      <section
                        key={filter.display_name}
                        className={s.section_filters_part}
                      >
                        <div className={s.section_filters_part_title}>
                          Filtrer par {filter.display_name}
                        </div>
                        <ul className={s.section_filters_part_options}>
                          {filter.values.map((option: string) => (
                            <li className={s.section_filters_part_options_item}>
                              <button onClick={SelectOption(option)}>
                                {option}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
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
        <div className="col-span-8 lg:col-span-2 order-1 lg:order-none">
          {/* Categories */}
          <div className="relative inline-block w-full">
            <div className="lg:hidden">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, 'categories')}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {activeCategory?.name
                    ? `Category: ${activeCategory?.name}`
                    : 'All Categories'}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== 'categories' || toggleFilter !== true
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        'block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                        {
                          underline: !activeCategory?.name,
                        }
                      )}
                    >
                      <Link
                        href={{ pathname: getCategoryPath('', brand), query }}
                      >
                        <a
                          onClick={(e) => handleClick(e, 'categories')}
                          className={
                            'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                          }
                        >
                          All Categories
                        </a>
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li
                        key={cat.path}
                        className={cn(
                          'block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                          {
                            underline:
                              activeCategory?.entityId === cat.entityId,
                          }
                        )}
                      >
                        {cat.children.length > 0 ? (
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
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
                            </AccordionSummary>
                            <AccordionDetails>
                              <ul>
                                {cat.children.map((subcat) => (
                                  <li
                                    key={subcat.path}
                                    className={cn(
                                      'block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                                      {
                                        underline:
                                          activeCategory?.entityId ===
                                          subcat.entityId,
                                      }
                                    )}
                                  >
                                    <Link
                                      href={{
                                        pathname: getCategoryPath(
                                          subcat.path,
                                          brand
                                        ),
                                        query,
                                      }}
                                    >
                                      <a
                                        onClick={(e) =>
                                          handleClick(e, 'categories')
                                        }
                                        className={
                                          'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                                        }
                                      >
                                        {subcat.name}
                                      </a>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionDetails>
                          </Accordion>
                        ) : (
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
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Designs */}
          <div className="relative inline-block w-full">
            <div className="lg:hidden mt-3">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, 'brands')}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {activeBrand?.name
                    ? `Design: ${activeBrand?.name}`
                    : 'All Designs'}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== 'brands' || toggleFilter !== true
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        'block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                        {
                          underline: !activeBrand?.name,
                        }
                      )}
                    >
                      <Link
                        href={{
                          pathname: getDesignerPath('', category),
                          query,
                        }}
                      >
                        <a
                          onClick={(e) => handleClick(e, 'brands')}
                          className={
                            'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                          }
                        >
                          All Designers
                        </a>
                      </Link>
                    </li>
                    {brands.flatMap(({ node }) => (
                      <li
                        key={node.path}
                        className={cn(
                          'block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                          {
                            // @ts-ignore Shopify - Fix this types
                            underline: activeBrand?.entityId === node.entityId,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname: getDesignerPath(node.path, category),
                            query,
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, 'brands')}
                            className={
                              'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                            }
                          >
                            {node.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products */}
        <div className="col-span-8 order-3 lg:order-none">
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
                    Showing{' '}
                    {
                      /* TODO : do it within the products request */
                      data.products.filter(
                        (el) =>
                          el.price.value >= minPriceFilter &&
                          el.price.value <= maxPriceFilter
                      ).length
                    }{' '}
                    results{' '}
                    {q && (
                      <>
                        for "<strong>{q}</strong>"
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
                        There are no products that match "<strong>{q}</strong>"
                      </>
                    ) : (
                      <>
                        There are no products that match the selected category &
                        designer
                      </>
                    )}
                  </span>
                </>
              ) : q ? (
                <>
                  Searching for: "<strong>{q}</strong>"
                </>
              ) : (
                <>Searching...</>
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
                  .map((product: Product) => {
                    /*
                    product.customFields.edges.forEach((el: any) => {
                      if (enabledFiltersNames.includes(el.node.name.toLowerCase())) {
                        addFilterValues(el.node.value, el.node.name.toLowerCase());
                      }
                    });
                    */
                    return (
                      <ProductCard
                        variant="simple"
                        key={product.path}
                        className="animated fadeIn"
                        product={product}
                        imgProps={{
                          width: 480,
                          height: 480,
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

        {/* Sort */}
        <div className="col-span-8 lg:col-span-2 order-2 lg:order-none">
          <div className="relative inline-block w-full">
            <div className="lg:hidden">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, 'sort')}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {sort ? `Sort: ${sort}` : 'Relevance'}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== 'sort' || toggleFilter !== true ? 'hidden' : ''
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        'block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                        {
                          underline: !sort,
                        }
                      )}
                    >
                      <Link href={{ pathname, query: filterQuery({ q }) }}>
                        <a
                          onClick={(e) => handleClick(e, 'sort')}
                          className={
                            'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                          }
                        >
                          Relevance
                        </a>
                      </Link>
                    </li>
                    {SORT.map(([key, text]) => (
                      <li
                        key={key}
                        className={cn(
                          'block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900',
                          {
                            underline: sort === key,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname,
                            query: filterQuery({ q, sort: key }),
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, 'sort')}
                            className={
                              'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                            }
                          >
                            {text}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

Search.Layout = Layout
