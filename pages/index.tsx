import { Layout } from '@components/common'
import { Grid, Marquee, Hero, Button } from '@components/ui'
import { ProductCard, ProductCard2 } from '@components/product'
import { HomeSection, HomeGrid, TopButton } from '@components/common'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { getConfig } from '@framework/api'
import getAllProducts from '@framework/product/get-all-products'
import getSiteInfo from '@framework/common/get-site-info'
import getAllPages from '@framework/common/get-all-pages'
// import HomeGrid from '../components/common/HomeGrid'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })

  const { products } = await getAllProducts({
    variables: { first: 12 },
    config,
    preview,
  })

  const { categories, brands } = await getSiteInfo({ config, preview })
  const { pages } = await getAllPages({ config, preview })

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 14400,
  }
}

export default function Home({
  products,
  brands,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <HomeSection></HomeSection>
      <HomeGrid
        title="Top des ventes"
        subtitle="Ajoutez nos meilleurs produits à votre panier."
        layout="line"
      >
        {products.slice(0, 4).map((product, i) => (
          <ProductCard2
            key={product.id}
            link={'/product/' + product.slug}
            title={product.name}
            variant="details"
            imageSrc={product.images[0].url}
            imageSrc2={product.images.length > 1 ? product.images[1].url : ''}
            product={product}
            imgProps={{
              width: 206,
              height: 256,
            }}
          />
        ))}
      </HomeGrid>
      <Button href="">Voir tous les produits</Button>
      <HomeGrid
        title="Produits de saison"
        subtitle="Consommez mieux avec des produits frais et locaux."
        layout="A"
      >
        <ProductCard2
          link=""
          title="Fruits"
          variant="simple"
          imageSrc="/cat_fruits.png"
          imgProps={{
            width: 441,
            height: 546,
          }}
        />
        <ProductCard2
          link=""
          title="Légumes"
          variant="simple"
          imageSrc="/cat_legumes.jpg"
          imgProps={{
            width: 441,
            height: 263,
          }}
        />
        <ProductCard2
          link=""
          title="Jus"
          variant="simple"
          imageSrc="/cat_jus.png"
          imgProps={{
            width: 441,
            height: 263,
          }}
        />
      </HomeGrid>
      <HomeGrid
        title="Dernières arrivées"
        subtitle="Retrouvez nos produits les plus recents disponibles dès maintenant !"
        layout="line"
      >
        {products.slice(4, 7).map((product, i) => (
          <ProductCard2
            key={product.id}
            link={'/product/' + product.slug}
            variant="details"
            title={product.name}
            imageSrc={product.images[0].url}
            imageSrc2={product.images.length > 1 ? product.images[1].url : ''}
            product={product}
            imgProps={{
              width: 206,
              height: 256,
            }}
          />
        ))}
      </HomeGrid>
      <HomeGrid layout="full">
        <ProductCard2
          link=""
          title="Lire notre blog"
          subtitle="Voir les articles"
          variant="full"
          imageSrc="/blog.png"
          imgProps={{
            width: 1000,
            height: 500,
          }}
        />
        <ProductCard2
          link=""
          title="Suivez-nous sur Instagram"
          subtitle="@locavores"
          variant="full"
          imageSrc="/instagram.png"
          imgProps={{
            width: 1000,
            height: 500,
          }}
        />
      </HomeGrid>
      <TopButton />
    </>
  )
}

Home.Layout = Layout
